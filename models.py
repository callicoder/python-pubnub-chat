
from index import db

class User(db.Document):
	email = db.EmailField(unique=True)
