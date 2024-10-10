from flask import Blueprint, jsonify
from app.models.aoi import AOI
from app import db

aoi_bp = Blueprint('aoi', __name__)

@aoi_bp.route('/aois', methods=['GET'])
def get_aois():
    try:
        aois = AOI.query.all()
        return jsonify([aoi.as_dict() for aoi in aois]), 200  # Convert AOIs to JSON format
    except Exception as e:
        return jsonify({'error': str(e)}), 500
