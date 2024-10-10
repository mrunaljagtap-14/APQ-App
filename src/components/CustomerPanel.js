import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Customerpanel.css';

const CustomerPanel = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [maturityWeightages, setMaturityWeightages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/customer_questions');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched questions:', data);
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (questionId, optionId, weightage) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [questionId]: optionId,
    }));

    // Store the maturity weightage of the selected option
    setMaturityWeightages((prevState) => ({
      ...prevState,
      [questionId]: weightage,
    }));
  };

  const handleNextClick = async () => {
    const responses = questions.map((question) => ({
      question_id: question.id,
      option_id: selectedOptions[question.id] || null,
      recorded_at: new Date().toISOString(),
    }));

    try {
      // Save user responses to the user_response table
      const saveResponseResponse = await fetch('http://localhost:5000/save_user_responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });

      if (!saveResponseResponse.ok) {
        throw new Error('Error saving responses');
      }

      // Navigate to the graph page and pass the maturity weightages
      navigate('/graph', { state: { weightages: Object.values(maturityWeightages) } });
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  };

  return (
    <div className="customer-panel">
      <h1 className="customer-panel__heading">Impact Assessment and Recommendations</h1>
      {Array.isArray(questions) && questions.length > 0 ? (
        <div>
          {questions.map((question) => (
            <div key={question.id} className="customer-panel__question-section">
              <h3 className="customer-panel__question-title">{question.question_text}</h3>
              <table className="customer-panel__options-table">
                <tbody>
                  {(question.options || []).map((option) => (
                    <tr key={option.id}>
                      <td>
                        <label>
                          <input
                            type="radio"
                            name={`question${question.id}_options`}
                            value={option.id}
                            checked={selectedOptions[question.id] === option.id}
                            onChange={() => handleOptionChange(question.id, option.id, option.maturity_weightage)}
                          />
                          {option.option_text}
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div>No questions available.</div>
      )}
      <div className="customer-panel__navigation-buttons">
        <button onClick={handleNextClick} className="customer-panel__next-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default CustomerPanel;
