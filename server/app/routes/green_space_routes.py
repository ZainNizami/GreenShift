from flask import Blueprint, jsonify
from app.services.green_space_service import get_green_space_data

green_bp = Blueprint('green', __name__)

@green_bp.route('/api/green-spaces', methods=['GET'])
def green_spaces():
    data = get_green_space_data()
    return jsonify(data)