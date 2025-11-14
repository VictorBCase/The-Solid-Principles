import pika, json

# draft code based on rabbit documentation. can change whatever you want

RABBITMQ_HOST = "rabbitmq"

def publish_events():
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
    channel = connection.channel()

    #check each event given psuedocode
    #for event in events:
    #    channel.basic_publish(
    #        exchange='',
    #        routing_key="",
    #        body=json.dumps(event),
    #        properties=pika.BasicProperties(
    #            delivery_mode=2,
    #        )
    #    )

    connection.close()
