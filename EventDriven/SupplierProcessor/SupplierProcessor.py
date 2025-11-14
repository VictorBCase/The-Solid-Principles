import json
import pika
import requests
import time

RABBITMQ_HOST = "rabbitmq"
SUPPLIER_QUEUE = "initial-events"
PRODUCT_QUEUE = "product_queue"
SUPPLIER_DLQ = "supplier_dlq"


SUPPLIER_API =  "http://kong:8000/suppliers" # change using APi gateway if needed


def validate_supplier_event(event: dict) -> bool:
    try:
        supplier = event["supplier"]
        if "supplier_name" not in supplier:
            return False
        if "supplier_contact" not in supplier:
            return False
        if "products" not in supplier:
            return False
        if not isinstance(supplier["products"], list):
            return False
       
        # supplier event is valid
        return True

    except Exception:
        return False

# Invalid events go to dlq
def send_to_dlq(channel, body):
    channel.basic_publish(
        exchange="",
        routing_key=SUPPLIER_DLQ,
        body=body
    )

def process_supplier(channel, method, properties, body):
    try:
        event = json.loads(body.decode())

        print("Supplier Event:")
        print(json.dumps(event, indent=2))

        # Validate event
        if not validate_supplier_event(event):
            print("Invalid supplier event, sending to DLQ")
            send_to_dlq(channel, body)
            channel.basic_ack(delivery_tag=method.delivery_tag)
            return

        supplier_info = event["supplier"]

        #Converting event fields to microservice fields
        supplier_payload = {
            "name": supplier_info["supplier_name"],
            "contact": supplier_info["supplier_contact"]
        }

        print("sending supplier to supplier microservice")
        resp = requests.post(SUPPLIER_API, json=supplier_payload)

        if resp.status_code not in [200, 201]:
            print("supplier service rejected event, sending to DLQ")
            send_to_dlq(channel, body)
            channel.basic_ack(delivery_tag=method.delivery_tag)
            return

        supplier_id = resp.json()["s_id"]
        print(f"supplier_id={supplier_id} is stored")

        # Go through each product event
        for product in supplier_info["products"]:
            product_event = {
                "supplier_id": supplier_id,
                "product": product
            }
            channel.basic_publish(
                exchange="",
                routing_key=PRODUCT_QUEUE,
                body=json.dumps(product_event)
            )
            print(f"Sent product event to {PRODUCT_QUEUE}")
        
        channel.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print("Error, sending to supplier DLQ: ", e)
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

def start_supplier_processor():

    connection = wait_for_rabbitmq()

    channel = connection.channel()

    channel.queue_declare(queue=SUPPLIER_QUEUE, durable=True)
    channel.queue_declare(queue=PRODUCT_QUEUE, durable=True)
    channel.queue_declare(queue=SUPPLIER_DLQ, durable=True)

    # routes messages to the process_supplier function
    channel.basic_consume(
        queue=SUPPLIER_QUEUE,
        on_message_callback=process_supplier
    )

    channel.start_consuming()


if __name__ == "__main__":
    start_supplier_processor()
