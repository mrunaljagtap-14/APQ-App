import React, { useState, useEffect } from 'react';

const QuestionForm = ({ onSubmit, question, aois }) => {
  const [questionText, setQuestionText] = useState('');  // For question text
  const [options, setOptions] = useState([{ option_text: '', weightage: '' }]);  // For options
  const [isActive, setIsActive] = useState(true);  // For active state
  const [aoi, setAoi] = useState('');  // For AOI selection

  // When the form is in edit mode, populate the fields with the selected question's data
  useEffect(() => {
    if (question) {
      setQuestionText(question.question_text || '');
      setOptions(question.options || [{ option_text: '', weightage: '' }]);
      setIsActive(question.is_active || true);
      setAoi(question.aoi || '');
    } else {
      // If no question is selected, reset the form
      setQuestionText('');
      setOptions([{ option_text: '', weightage: '' }]);
      setIsActive(true);
      setAoi('');
    }
  }, [question]);  // Re-run this effect when the selected question changes

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      question_text: questionText,
      options,
      is_active: isActive,
      aoi
    };
    onSubmit(questionData);  // Call the appropriate submit function (add or edit)
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>AOI</label>
        <select value={aoi} onChange={(e) => setAoi(e.target.value)} required>
          <option value="" disabled>Select AOI</option>
          {aois.map((aoiItem) => (
            <option key={aoiItem.AOI_id} value={aoiItem.AOI_text}>
              {aoiItem.AOI_text}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Question Text</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
        />
      </div>

      {options.map((option, index) => (
        <div key={index}>
          <label>Option {index + 1}</label>
          <input
            type="text"
            value={option.option_text}
            onChange={(e) => handleOptionChange(index, 'option_text', e.target.value)}
            required
          />
          <select
            value={option.weightage}
            onChange={(e) => handleOptionChange(index, 'weightage', e.target.value)}
            required
          >
            <option value="1">Weightage 1</option>
            <option value="2">Weightage 2</option>
            <option value="3">Weightage 3</option>
            <option value="4">Weightage 4</option>
          </select>
        </div>
      ))}
      <button type="button" onClick={() => setOptions([...options, { option_text: '', weightage: '' }])}>
        Add Option
      </button>

      <div>
        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default QuestionForm;
