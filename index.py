from flask import Flask, request, render_template, send_from_directory, url_for, jsonify
import json
from bson import json_util
from bson.objectid import ObjectId
from pymongo import MongoClient
from pubnub import Pubnub
import os

# Flask App
app = Flask(__name__)

# Mongo Connection
client = MongoClient(os.environ.get('MONGOLAB_URI') or 'mongodb://localhost/flaskDB')
db = client.get_default_database()


# Pubnub config
pubnub = Pubnub(publish_key="pub-c-f60b2d34-f3ba-4374-a586-04811891c5f0", subscribe_key="sub-c-48eeb7d0-51b2-11e5-81b5-02ee2ddab7fe")

# Pubnub callbacks
def _callback(message, channel):
    print(message)
    chatCollection = db.chats
    chatCollection.insert_one({
    	"message": message,
    	"channel": channel
    })
  
def _error(message):
    print("ERROR : " + str(message))
  
  
def _connect(message):
    print("CONNECTED")
    print pubnub.publish(channel='my_channel', message='Hello from the PubNub Python SDK')
  
  
  
def _reconnect(message):
    print("RECONNECTED")
  
  
def _disconnect(message):
    print("DISCONNECTED")
  

pubnub.subscribe(channels='ChatApp', callback=_callback, error=_error,
                 connect=_connect, reconnect=_reconnect, disconnect=_disconnect)


@app.route('/')
def index():
	return render_template('index.html')


@app.route('/messages')
def messages():
	chatCollection = db.chats;
	chatMessages = list(chatCollection.find({}))
	return json_util.dumps(chatMessages)			


# Serve Favicon
@app.route('/favicon.ico')
def favicon():
	return send_from_directory(os.path.join(app.root_path, 'static'), 'img/favicon.ico')


if __name__ == '__main__':
	app.run() 