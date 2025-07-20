from flask import Blueprint, jsonify
from app.services.neighbourhood_service import get_neighbourhood_data

neighbourhood_bp = Blueprint("neighbourhood", __name__)

@neighbourhood_bp.route('/api/neighbourhoods', methods=['GET'])
def get_neighbourhoods():
    try:
        data = get_neighbourhood_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
