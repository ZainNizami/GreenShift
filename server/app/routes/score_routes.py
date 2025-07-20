from flask import Blueprint, jsonify
from app.services.score_service import compute_sustainability_scores
from urllib.parse import unquote

score_bp = Blueprint('score', __name__)

@score_bp.route('/api/score/', methods=['GET'])
def api_score():
    return "testing"

#score_bp.route('/api/score/<neighbourhood>', methods=['GET'])
def sustainability_score_by_neighbourhood(neighbourhood):
    scores = compute_sustainability_scores()

    # Normalize input to match neighbourhood names
    query = unquote(neighbourhood).strip().lower()

    match = next(
        (n for n in scores if n.get("neighbourhood", "").strip().lower() == query),
        None
    )

    if match:
        return jsonify(match)
    else:
        return jsonify({"error": f"No data found for neighbourhood: {neighbourhood}"}), 404

#@score_bp.route('/api/score', methods=['GET'])
def sustainability_score_all():
    return jsonify(compute_sustainability_scores())
