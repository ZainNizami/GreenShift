from flask import Blueprint, jsonify
from app.services.gemini_client import res  # import cached results

score_bp = Blueprint("score", __name__)

@score_bp.route('/api/score/<neighbourhood>', methods=['GET'])
def get_neighbourhood_score(neighbourhood):
    for score in res:
        if score["neighbourhood"].lower() == neighbourhood.lower():
            return jsonify(score)
    return jsonify({"error": "Neighbourhood not found"}), 404