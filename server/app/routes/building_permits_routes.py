from flask import Blueprint, jsonify
from app.services.building_permits_service import get_active_building_permits

permits_bp = Blueprint('permits', __name__)

@permits_bp.route('/api/building-permits', methods=['GET'])
def active_permits():
    data = get_active_building_permits()
    return jsonify(data)
