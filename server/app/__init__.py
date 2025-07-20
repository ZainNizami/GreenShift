from flask import Flask
from app.routes.scores_routes import score_bp
from app.routes.neighbourhood_routes import neighbourhood_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(score_bp)
    app.register_blueprint(neighbourhood_bp)

    return app