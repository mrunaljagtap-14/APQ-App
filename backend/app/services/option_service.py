from app.models.question import Option
from app import db

def create_option(option_data):
    new_option = Option(**option_data)
    db.session.add(new_option)
    db.session.commit()
    return new_option

def get_options_by_question_id(question_id):
    return Option.query.filter_by(question_id=question_id).all()
