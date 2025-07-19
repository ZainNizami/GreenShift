from flask import Flask
from app.routes.scores_routes import score_bp

def create_app():
    app = Flask(__name__)

    app.register_blueprint(score_bp)

    return app