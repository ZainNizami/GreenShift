from flask import Flask
from flask_cors import CORS

from app.routes.neighbourhood_routes import neighbourhood_bp
from app.routes.green_space_routes import green_bp
from app.routes.building_permits_routes import permits_bp
from app.routes.affordable_units_routes import units_bp
from app.routes.score_routes import score_bp
from app.routes.sus_routes import sus_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(neighbourhood_bp)
    app.register_blueprint(score_bp) 
    app.register_blueprint(green_bp)
    app.register_blueprint(permits_bp)
    app.register_blueprint(units_bp)
    app.register_blueprint(sus_bp)

    return app