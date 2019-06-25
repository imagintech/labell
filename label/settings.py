#settings.py
import os
# __file__ refers to the file settings.py 
APP_ROOT = os.path.dirname(os.path.abspath(__file__))   # refers to application_top
APP_DATASET = os.path.join(APP_ROOT, 'static/dataset')
# DATABASE_URL = os.environ.get("DATABASE_URL", default=None)
DATABASE_URL = "mongodb://localhost:27017/labell_db"