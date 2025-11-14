import os
import json
import time
import pika

EVENTS_DIR = "events"
QUEUE_NAME = "intitial-events"


def wait_for_rabbitmq():
    while True:
        try:
            print("Connecting to RabbitMQ...")
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host="rabbitmq")
            )
            print("Connected to RabbitMQ!")
            return connection
        except Exception as e:
            print(f"RabbitMQ not ready: {e}")
            time.sleep(2)


def publish_events(channel):
    if not os.path.isdir(EVENTS_DIR):
        print(f"Events directory '{EVENTS_DIR}' not found.")
        return

    files = sorted(f for f in os.listdir(EVENTS_DIR) if f.endswith(".json"))
    print(f"Found {len(files)} event files.", flush=True)

    for filename in files:
        filepath = os.path.join(EVENTS_DIR, filename)

        try:
            with open(filepath, "r") as f:
                event_data = json.load(f)

            channel.basic_publish(
                exchange="",
                routing_key=QUEUE_NAME,
                body=json.dumps(event_data),
                properties=pika.BasicProperties(
                    content_type="application/json"
                )
            )

            print(f"Published event: {filename}", flush=True)

        except Exception as e:
            print(f"Error publishing {filename}: {e}")


def main():
    connection = wait_for_rabbitmq()
    channel = connection.channel()

    channel.queue_declare(queue=QUEUE_NAME, durable=True)

    publish_events(channel)

    print("All events published.")

    while True:
        time.sleep(60)


if __name__ == "__main__":
    print("Starting publisher...")
    main()
