# from app import db
# from datetime import datetime

# class Question(db.Model):
#     __tablename__ = 'questions'
#     question_id = db.Column(db.Integer, primary_key=True)
#     question_text = db.Column(db.String(255), nullable=False)
#     is_active = db.Column(db.Boolean, default=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     def as_dict(self):
#         return {
#             'question_id': self.question_id,
#             'question_text': self.question_text,
#             'is_active': self.is_active,
#             'created_at': self.created_at,
#             'updated_at': self.updated_at,
#         }

# class Option(db.Model):
#     __tablename__ = 'options'
#     option_id = db.Column(db.Integer, primary_key=True)
#     question_id = db.Column(db.Integer, db.ForeignKey('questions.question_id'), nullable=False)
#     option_text = db.Column(db.String(255), nullable=False)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     def as_dict(self):
#         return {
#             'option_id': self.option_id,
#             'question_id': self.question_id,
#             'option_text': self.option_text,
#             'created_at': self.created_at,
#             'updated_at': self.updated_at,
#         }
from app import db
from datetime import datetime

class Question(db.Model):
    __tablename__ = 'question'
    question_id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    options = db.relationship('Option', backref='question', lazy=True)

    def as_dict(self):
        return {
            'question_id': self.question_id,
            'question_text': self.question_text,
            'is_active': self.is_active,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'options': [option.as_dict() for option in self.options]
        }
