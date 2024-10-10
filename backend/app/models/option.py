from app import db
from datetime import datetime

# class Option(db.Model):
#     option_id = db.Column(db.Integer, primary_key=True)
#     question_id = db.Column(db.Integer, db.ForeignKey('question.question_id'), nullable=False)
#     option_text = db.Column(db.String(255), nullable=False)
#     weightage = db.Column(db.String(50), nullable=True)
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
class Option(db.Model):
    __tablename__ = 'options'
    option_id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.question_id'), nullable=False)
    option_text = db.Column(db.String(255), nullable=False)
    weightage = db.Column(db.Integer(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def as_dict(self):
        return {
            'option_id': self.option_id,
            'question_id': self.question_id,
            'option_text': self.option_text,
            'weightage': self.weightage,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
