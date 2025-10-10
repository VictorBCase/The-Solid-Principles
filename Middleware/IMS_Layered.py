#IMS_Layered.py
# pip install psycopg2-binary to install dependencies for psycopg - python library for postgresql

import psycopg2
from contextlib import contextmanager
import uuid

DB_CONFIG = {
    "dbname": "nameplaceholder", #honestly forgot what I named the DB ill check later
    "user": "postgres",
    "password": "solid", # DB password
    "host": "",  # add when docker set up for containers
    "port": 5433 # Postgresql port (otherwise try 5432)
}

# Using contextmanager to handle database connection
@contextmanager
def get_conn():
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()



# ================= CRUD FUNCTIONS ===================

# Generate UUID
def gen_uuid():
    return str(uuid.uuid4())
