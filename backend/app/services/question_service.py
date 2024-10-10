from app.models.question import Question, Option
from app import db

def get_all_questions():
    try:
       print(f"Fetched questions: {Question}")  # Log for debugging
       return Question.query.all()
    except Exception as e:
        print(f"Error fetching questions: {e}")
        raise

def get_question_by_id(question_id):
    return Question.query.get(question_id)

def create_question(question_data):
    new_question = Question(**question_data)
    db.session.add(new_question)
    db.session.commit()
    return new_question

def update_question(question_id, question_data):
    question = get_question_by_id(question_id)
    if question:
        question.question_text = question_data['question_text']
        question.is_active = question_data.get('is_active', question.is_active)
        db.session.commit()
    return question

def delete_question(question_id):
    question = get_question_by_id(question_id)
    if question:
        db.session.delete(question)
        db.session.commit()
    return question
