from flask_pymongo import PyMongo

class mongo:
	def __init__(self, app):
		app.config["MONGO_URI"] = "mongodb://localhost:27017/labell_db"
		self.mongo = PyMongo(app)


	def get_all_templates(self, userId):
		result = self.mongo.db.users.find_one({'userId' : userId}, {'templates':1 , '_id':0})
		return result

	def get_all_datasets(self, userId):
		result = self.mongo.db.users.find_one({'userId' : userId}, {'datasets':1 , '_id':0})
		return result

	def insert_template(self, userId, templateJson):
		self.mongo.db.users.update({'userId' : userId}, {'$push' : {'templates' : templateJson}})
		
	def insert_dataset(self, userId, datasetJson):
		print(datasetJson)
		self.mongo.db.users.update({'userId' : userId}, {'$push' : {'datasets' : datasetJson}})
