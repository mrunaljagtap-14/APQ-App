from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .config.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)  # Initialize the db with the Flask app

    from app.api.question_routes import question_bp
    from app.api.aoi_routes import aoi_bp
    #from app.api.option_routes import option_routes
    app.register_blueprint(question_bp, url_prefix='/api')
    app.register_blueprint(aoi_bp, url_prefix='/api') 
    #app.register_blueprint(option_routes, url_prefix='/api') 

    # Return the application instance
    return app
