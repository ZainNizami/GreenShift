from flask import Blueprint, jsonify
from app.jsonfilefilter import get_static_dataset

sus_bp = Blueprint('sus', __name__)
@sus_bp.route('/api/sus', methods=['GET'])
def get_sus():
    data = get_static_dataset()
    return jsonify(data)
