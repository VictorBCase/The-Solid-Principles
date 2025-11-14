import json
import pika
import requests
import time

RABBITMQ_HOST = "rabbitmq"
PRODUCT_QUEUE = "product_queue"
PRODUCT_DLQ = "product_dlq"

PRODUCT_API = "http://kong:8000/products" # change to kong api if needed


def validate_product_event(event: dict) -> bool:
    try:
        product = event["product"]
        if "product_name" not in product:
            return False
        if "product_description" not in product:
            return False
        if "product_quantity" not in product or not isinstance(product["product_quantity"], int):
            return False
        if "product_price" not in product or not isinstance(product["product_price"], (int, float)):
            return False
        if "supplier_id" not in event:
            return False
        return True
    except Exception:
        return False

# Invalid events go to dlq
def send_to_dlq(channel, body):
    channel.basic_publish(
        exchange="",
        routing_key=PRODUCT_DLQ,
        body=body
    )


def process_product(channel, method, properties, body):
    try:
        event = json.loads(body.decode())
        print("Product Event:")
        print(json.dumps(event, indent=2))

        if not validate_product_event(event):
            print("Invalid product event, sending to DLQ")
            send_to_dlq(channel, body)
            channel.basic_ack(delivery_tag=method.delivery_tag)
            return

        product = event["product"]
        supplier_id = event["supplier_id"]

        processor_payload = {
            "name": product["product_name"],
            "description": product["product_description"],
            "quantity": product["product_quantity"],
            "price": str(product["product_price"])
        }

        print("Sending product to product microservice")
        resp = requests.post(PRODUCT_API, json=processor_payload)

        if resp.status_code != 200:
            print("Product service rejected event, sending to DLQ")
            send_to_dlq(channel, body)
            channel.basic_ack(delivery_tag=method.delivery_tag)
            return

        product_id = resp.json()["p_id"]
        print(f"Stored product_id={product_id} for supplier_id={supplier_id}")

        # associate product with supplier
        assoc_resp = requests.post(f"{PRODUCT_API}s/{supplier_id}/products/{product_id}")
        if assoc_resp.status_code != 200:
            print(f"Failed to associate product with supplier {supplier_id}")

        channel.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print(f"Error processing product: {e}, sending to DLQ")
        send_to_dlq(channel, body)
        channel.basic_ack(delivery_tag=method.delivery_tag)

def wait_for_rabbitmq():
    while True:
        try:
            print("Connecting to RabbitMQ...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST)
            )
            print("Connected to RabbitMQ!")
            return connection
        except Exception as e:
            print(f"RabbitMQ not ready: {e}")
            time.sleep(2)

def start_product_processor():
    connection = wait_for_rabbitmq()
    channel = connection.channel()

    channel.queue_declare(queue=PRODUCT_QUEUE, durable=True)
    channel.queue_declare(queue=PRODUCT_DLQ, durable=True)

   # routes messages to the process_product function
    channel.basic_consume(
        queue=PRODUCT_QUEUE,
        on_message_callback=process_product
    )

    channel.start_consuming()


if __name__ == "__main__":
    start_product_processor()
