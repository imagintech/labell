from label import app
from label.database import mongo
from flask import render_template, jsonify, request
import json

user = "1995"

# initialise the db
db = mongo(app)

# welcome page
@app.route('/')
def welcome_page():
	all_templates = db.get_all_templates(user)
	datasets = db.get_all_datasets(user)
	my_templates = []
	my_datasets = []
	if all_templates is not None:
		my_templates = all_templates['templates']
	if dataset is not None:
		my_datasets = datasets['datasets']
	return render_template('base.html', request=request, templates=my_templates, datasets=my_datasets)

@app.route('/create_template', methods = ['POST'])
def create_template():
	name  = request.form['name']
	data  = json.loads(request.form['data'])
	
	templateJson = {
			"name" : name,
			"structure" : data
	}
	db.insert_template(user, templateJson)
	return "SUCCESS"

@app.route('/create_dataset', methods = ['POST'])
def create_dataset():
	name = request.form['name']
	folder = request.form['folder']

	datasetJson = {
			"name" : name,
			"folder" : folder
	}
	db.insert_dataset(user, datasetJson)
	return "SUCCESS"

@app.route('/label', methods = ['POST'])
def label_page():
	template = request.form['template']
	dataset = request.form['dataset']
	return render_template('label.html', template=template, dataset=dataset)

@app.route('/audio-connect', methods = ['GET'])
def audio_connect_page():
	return render_template('audio_connect.html')