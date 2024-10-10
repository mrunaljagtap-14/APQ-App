from app import db
from datetime import datetime

class AOI(db.Model):
    __tablename__ = 'aoi'
    AOI_id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.question_id'), nullable=False)
    AOI_text = db.Column(db.String(255), nullable=False)

    def as_dict(self):
        return {
            'AOI_id': self.AOI_id,
            'question_id': self.question_id,
            'AOI_text': self.AOI_text
        }
