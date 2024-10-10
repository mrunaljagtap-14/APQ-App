from flask import Blueprint, request, jsonify
from app.services.option_service import add_option

option_routes = Blueprint('options', __name__)

@option_routes.route('/options', methods=['POST'])
def create_option():
    data = request.json
    question_id = data['question_id']
    option_text = data['option_text']
    weightage = data.get('weightage')
    new_option = add_option(question_id, option_text, weightage)
    return jsonify(new_option)
