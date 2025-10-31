from typing import Optional
import psycopg2
from contextlib import contextmanager
import uuid
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

# database connection =========================================================
DB_CONFIG = {
	"dbname": "image_db",
	"user": "postgres",
	"password": "solid",
	"host": "image_db",  # add when docker set up for containers
	"port": 5432
}

@contextmanager
def get_conn():
	conn = psycopg2.connect(**DB_CONFIG)
	try:
		yield conn
	finally:
		conn.close()

# validation functions ========================================================
def gen_uuid():
	return str(uuid.uuid4())

def validate_nonempty(field_name: str, value: str):
	if value is None:
		raise ValueError(f"{field_name} cannot be None.")
	value = str(value).strip()
	if not value:
		raise ValueError(f"{field_name} must be a non-empty string.")

def validate_positive(field_name: str, value):
	if not isinstance(value, (int, float)) or value <= 0:
		raise Exception(f"{field_name} must be a positive number.")

def validate_nonnegative(field_name: str, value):
	if not isinstance(value, int) or value < 0:
		raise Exception(f"{field_name} must be a non-negative integer.")

# database functions ==========================================================
def images_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (image_id) FROM images""")
			return c.fetchall()

def image_create(product_id: str, url: str) -> str:
    try:
        validate_nonempty("product_id", product_id)
        validate_nonempty("url", url)
        iid = gen_uuid()
        with get_conn() as conn:
            with conn.cursor() as c:
                c.execute("""
                    INSERT INTO images (image_id, product_id, url)
                    VALUES (%s, %s, %s)
                """, (iid, product_id, url))
                conn.commit()
        return iid
    except Exception as e:
        raise Exception(f"Failed to create image: {str(e)}")

def image_read(image_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM images WHERE image_id = %s", (image_id,))
            row = c.fetchall()[0]
            ret = []
            for data in row:
                ret.append(str(data))
            return ret

def image_update(image_id: str, product_id: str, url: str) -> Optional[tuple]:
    try:
        validate_nonempty("product_id", product_id)
        validate_nonempty("url", url)
        with get_conn() as conn:
            with conn.cursor() as c:
                c.execute("""
                    UPDATE images
                    SET product_id = %s, url = %s
                    WHERE image_id = %s
                """, (product_id, url, image_id))
                conn.commit()
        return image_read(image_id)
    except Exception as e:
        raise Exception(f"Failed to update image: {str(e)}")

def image_delete(image_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM images WHERE image_id = %s", (image_id,))
            conn.commit()

# http server config ==========================================================
class Image(BaseModel):
	p_id: str
	url: str

app = FastAPI()

app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_methods=["*"],
		allow_headers=["*"]
)

@app.options("/")
def preflight_handler():
	headers = {
		"Access-Control-Allow-Origin": "http://localhost:5173",
		"Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
		"Access-Control-Allow-Headers": "Content-Type",
	}
	return Response(status_code=200, headers=headers)

@app.get("/")
async def read_images(i_id: Optional[str] = None):
	if (i_id is None):
		return {"i_id": "empty"}
	return {"i_id": i_id}

@app.put("/{i_id}")
def update_image(i_id: str, img: Image):
	#return {"image": img}
	try:
		data = image_update(i_id, img.name, img.url)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=str(ex))
	return {"image": data}

@app.post("/")
def create_image(img: Image):
	#return {"image": img}
	try:
		data = image_create(img.name, img.url)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=str(ex))
	return {"i_id": data}

@app.delete("/{i_id}")
def delete_image(i_id: str):
    try:
        image_delete(i_id)
        return {"deleted": i_id}
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))