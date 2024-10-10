import React from 'react';

const QuestionList = ({ questions, onUpdate, onDelete }) => {
  return (
    <ul>
      {questions.map((question) => (
        <li key={question.question_id}>
          {question.question_text}
          {/* <button onClick={() => onUpdate(question.question_id, { is_active: !question.is_active })}>
            {question.is_active ? 'Deactivate' : 'Activate'}
          </button> */}
          <button onClick={() => onDelete(question.question_id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default QuestionList;
