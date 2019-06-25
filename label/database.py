from flask_pymongo import PyMongo
import os
import json

from label.settings import APP_DATASET
from label.settings import DATABASE_URL

path 		= os.path.join(APP_DATASET, 'waiting')
changepath 	= os.path.join(APP_DATASET, 'completed')
savepath 	= os.path.join(APP_DATASET, 'out')

DEBUG = True

class mongo:
	def __init__(self, app):
		app.config["MONGO_URI"] = DATABASE_URL
		self.mongo = PyMongo(app)

	def log(self, value):
		if(DEBUG):
			print(value)

	def get_all_templates(self, userId):
		result = self.mongo.db.users.find_one({'userId' : userId})
		self.log(result)
		if result not None:
			return result['templates']
		else:
			return {}

	def get_all_datasets(self, userId):
		result = self.mongo.db.users.find_one({'userId' : userId})
		self.log(result)
		if result not None:
			return result['datasets']
		else:
			return {}

	def insert_template(self, userId, templateJson):

		self.log(templateJson)

		# construct necessary parameters
		templateId = userId+"_"+templateJson['name']

		templateJson['templateId'] = templateId

		# insert into templates collection
		self.mongo.db.templates.insert(templateJson)

		# update the corresponding user
		self.mongo.db.users.update({'userId' : userId}, {'$push' : {'templates' : templateJson['name']}})

	def insert_dataset(self, userId, datasetJson):

		self.log(datasetJson)

		# construct necessary parameters
		datasetId = userId+"_"+datasetJson['name']

		datasetJson['datasetId'] = datasetId

		# insert into datasets collection
		self.mongo.db.datasets.insert(datasetJson)

		# update corresponding user
		self.mongo.db.users.update({'userId' : userId}, {'$push' : {'datasets' : datasetJson['name']}})

	def get_template(self, userId, templateName):

		templateId = userId+"_"+templateName

		return self.mongo.db.templates.find_one({'templateId' : templateId}, {'_id': False})

	def get_dataset(self, userId, datasetName):

		datasetId = userId+"_"+datasetName

		return self.mongo.db.datasets.find_one({'datasetId' : datasetId}, {'_id': False})

	def get_next_image(self):
		images = os.listdir(path)
		pth = '/static/dataset/waiting/'
		print(images)
		if len(images) > 1 :
			return pth + images[1]
		else:
			return ""

	def save_image(self, url, data):

		# save the received data.
		filename = url[url.rfind("/")+1:]
		filename_json = os.path.splitext(filename)[0]+".json"

		print(filename, filename_json)
		with open(os.path.join(savepath, filename_json), 'w') as json_file:
			json.dump(data, json_file)

		# move image from waiting to completed
		os.rename(os.path.join(path, filename), os.path.join(changepath, filename))

		return "SUCCESS"
