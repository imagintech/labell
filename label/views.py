from label import app
from label.database import mongo
from flask import render_template, jsonify, request, redirect, url_for
import json

user = "1995"
successMessage = "SUCCESS"
baseUrl = "/labell"

# initialise the db
db = mongo(app)

# session kind of variable
message = {}

def refreshMessage():
	message["type"] = ""
	message["title"] = ""

# welcome page
@app.route(baseUrl+'/')
def base():

	templates = db.get_all_templates(user)
	datasets = db.get_all_datasets(user)
	
	base_template = render_template('base.html', request=request, templates=templates, datasets=datasets, message=message)
	refreshMessage()
	return base_template

@app.route(baseUrl+'/create_template', methods = ['POST'])
def create_template():
	name  = request.form['name']
	data  = json.loads(request.form['data'])
	
	templateJson = {
			"name" : name,
			"structure" : data
	}
	db.insert_template(user, templateJson)

	return successMessage

@app.route(baseUrl+'/create_dataset', methods = ['POST'])
def create_dataset():
	name = request.form['name']
	folder = request.form['folder']

	datasetJson = {
			"name" : name,
			"url" : folder
	}
	db.insert_dataset(user, datasetJson)

	return successMessage

@app.route(baseUrl+'/label', methods = ['POST'])
def label_page():

	# get request parameters
	templateName	= request.form['template']
	datasetName		= request.form['dataset']

	# validate the parameters
	if not templateName or not datasetName:
		message["type"] = "ERROR"
		message["title"] = "template or dataset not selected :("
		return redirect(url_for('base'))

	# get needed data from DB
	template = db.get_template(user, templateName)
	dataset = db.get_dataset(user, datasetName)

	# validate the db results
	if not template or not dataset:
		message["type"] = "ERROR"
		message["title"] = "template or dataset invalid :("
		return redirect(url_for('base'))

	label_template = render_template('label.html', template=template, dataset=dataset)
	refreshMessage()

	return label_template
	

@app.route(baseUrl+'/next_image', methods = ['POST'])
def get_next_image():
	return db.get_next_image()

@app.route(baseUrl+'/save_image', methods = ['POST'])
def save_image():
	url   = request.form['url']
	data  = json.loads(request.form['data'])
	resp  = db.save_image(url, data)
	return resp

@app.route('/audio-connect', methods = ['GET'])
def audio_connect_page():
	return render_template('audio_connect.html')