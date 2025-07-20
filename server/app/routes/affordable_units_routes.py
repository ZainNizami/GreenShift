from flask import Blueprint, jsonify
from app.services.affordable_units_service import get_affordable_units

units_bp = Blueprint('affordable_units', __name__)

@units_bp.route('/api/affordable-units', methods=['GET'])
def affordable_units():
    data = get_affordable_units()
    return jsonify(data)
