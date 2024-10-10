# from flask import Blueprint, request, jsonify
# from app.services.question_service import get_all_questions, create_question, update_question, delete_question

#question_bp = Blueprint('question', __name__)

# @question_bp.route('/questions', methods=['GET'])
# def get_questions():
#  try:
#     questions = get_all_questions()
#     return jsonify([q.as_dict() for q in questions])
#  except Exception as e:
#         print(f"Error fetching questions: {str(e)}")  # Log the error for debugging
#         return jsonify({'error': 'An error occurred while fetching questions'}), 500
 
# @question_bp.route('/questions', methods=['POST'])
# def add_question():
#     data = request.json
#     question = create_question(data)
#     return jsonify(question.as_dict())

# @question_bp.route('/questions/<int:question_id>', methods=['PUT'])
# def edit_question(question_id):
#     data = request.json
#     question = update_question(question_id, data)
#     return jsonify(question.as_dict())

# @question_bp.route('/questions/<int:question_id>', methods=['DELETE'])
# def delete_question(question_id):
#     question = delete_question(question_id)
#     return jsonify({'message': 'Question deleted successfully'})

from flask import Blueprint, request, jsonify
from app import db
from app.models.question import Question
from app.models.option import Option

question_bp = Blueprint('question', __name__)

@question_bp.route('/questions', methods=['POST'])
def add_question():
    data = request.json
    try:
        # Add Question
        question = Question(
            question_text=data['question_text'],
            is_active=data['is_active']
        )
        db.session.add(question)
        db.session.commit()

        # Add Options
        for option in data['options']:
            new_option = Option(
                question_id=question.question_id,
                option_text=option['option_text'],
                weightage=option['weightage']
            )
            db.session.add(new_option)

        db.session.commit()
        return jsonify({'message': 'Question and options added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@question_bp.route('/questions', methods=['GET'])
def get_questions():
    try:
        questions = Question.query.all()
        return jsonify([q.as_dict() for q in questions]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @question_bp.route('/questions/<int:question_id>', methods=['PUT'])
# def update_question(question_id):
#     data = request.json
#     try:
#         question = Question.query.get(question_id)
#         if question:
#             question.question_text = data['question_text']
#             question.is_active = data['is_active']

#             # Update options
#             for option_data in data['options']:
#                 option = Option.query.get(option_data['option_id'])
#                 option.option_text = option_data['option_text']
#                 option.weightage = option_data['weightage']

#             db.session.commit()
#             return jsonify({'message': 'Question and options updated successfully'}), 200
#         return jsonify({'error': 'Question not found'}), 404
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 500
    
@question_bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    try:
        question = Question.query.get(question_id)
        if question:
            db.session.delete(question)
            db.session.commit()
            return jsonify({'message': 'Question deleted successfully'}), 200
        return jsonify({'error': 'Question not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@question_bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    data = request.json
    try:
        # Fetch the question by ID
        question = Question.query.get(question_id)
        if not question:
            return jsonify({'error': 'Question not found'}), 404

        # Update the question fields
        question.question_text = data.get('question_text', question.question_text)
        question.is_active = data.get('is_active', question.is_active)

        # Update the options associated with the question
        if 'options' in data:
            for option_data in data['options']:
                option_id = option_data.get('option_id')

                # Fetch the option by ID and update its fields
                option = Option.query.get(option_id)
                if option and option.question_id == question_id:  # Ensure option belongs to the question
                    option.option_text = option_data.get('option_text', option.option_text)
                    option.weightage = option_data.get('weightage', option.weightage)
                else:
                    return jsonify({'error': f'Option with id {option_id} not found or does not belong to this question'}), 404

        # Commit the changes to the database
        db.session.commit()
        return jsonify({'message': 'Question and options updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500