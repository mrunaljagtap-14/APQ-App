import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Adminpanel.css'; // Adjust the path as necessary

function AdminPanel() {
  const navigate = useNavigate();
  const [areasOfImpact, setAreasOfImpact] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [editMode, setEditMode] = useState(false);

  // Fetch Areas of Impact on component load
  useEffect(() => {
    const fetchAreasOfImpact = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/areas_of_impact');
        const data = await response.json();
        setAreasOfImpact(data);
      } catch (error) {
        console.error('Error fetching areas of impact:', error);
      }
    };

    fetchAreasOfImpact();
  }, []);

  // Fetch Questions based on the selected area of impact (aoi_id)
  const fetchQuestions = async (aoi_id) => {
    try {
      const response = await fetch(`http://localhost:5000/questions?aoi_id=${aoi_id}`); // Correct query param name
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Handle area of impact selection
  const handleAreaChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const selected = areasOfImpact.find(area => area.aoi_id === selectedId);
    setSelectedArea(selected);
    setSelectedOptions({});
    fetchQuestions(selectedId);
  };

  // Handle option change for each question
  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };

  // Handle weightage change in edit mode
  const handleWeightageChange = (questionIndex, optionId, newWeightage) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.forEach(option => {
      if (option.id === optionId) {
        option.weightage = newWeightage;
      }
    });
    setQuestions(updatedQuestions);
  };

  // Toggle edit mode for editing weightage
  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  // Submit selected options and area of impact
  const handleNextClick = async () => {
    if (!selectedArea) {
      alert('Please select an area of impact.');
      return;
    }

    const dataToSubmit = {
      areaId: selectedArea.aoi_id,
      options: selectedOptions
    };

    try {
      const response = await fetch('http://localhost:5000/api/submit_selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Data submitted successfully: ' + JSON.stringify(result));
      } else {
        alert('Error submitting data: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  // Navigate back to admin page
  const handleBackClick = () => {
    navigate('/adminpage');
  };

  return (
    <div className="App">
      <div className="header">
        <h1 className="heading">Impact Assessment and Recommendations</h1>
        <button className="edit-button" onClick={handleEditClick}>
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div>
        <select onChange={handleAreaChange} className="dropdown" defaultValue="">
          <option value="" disabled>Select an area of impact</option>
          {areasOfImpact.map(area => (
            <option key={area.aoi_id} value={area.aoi_id}>
              {area.aoi_text}
            </option>
          ))}
        </select>
      </div>

      {questions.length > 0 && (
        <>
          {questions.map((questionSet, questionIndex) => (
            <div key={questionSet.id} className="question-section">
              <h2 className="question-title">
                  {`${questionIndex + 1}. ${questionSet.question_text.replace(/^\d+\.\s*/, '')}`}
             </h2>

              <table className="options-table">
                <thead>
                  <tr>
                    <th>Options</th>
                    <th>Weightage</th>
                  </tr>
                </thead>
                <tbody>
                  {questionSet.options.map(option => (
                    <tr key={option.id}>
                      <td>
                        <label>
                          <input
                            type="radio"
                            name={`question${questionSet.id}_options`}
                            value={option.id}
                            checked={selectedOptions[questionSet.id] === option.id}
                            onChange={() => handleOptionChange(questionSet.id, option.id)}
                          />
                          {option.option_text}
                        </label>
                      </td>
                      <td>
                        {editMode ? (
                          <input
                            type="number"
                            value={option.weightage}
                            onChange={(e) => handleWeightageChange(questionIndex, option.id, e.target.value)}
                          />
                        ) : (
                          <span>{option.weightage}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedOptions[questionSet.id] && (
                <div className="assessment-section">
                  <h3 className='assessment-heading'>Assessment:</h3>
                  <p>{questionSet.options.find(option => option.id === selectedOptions[questionSet.id])?.assessment}</p>
                  <h3 className='recommendation-heading'>Recommendation:</h3>
                  <p>{questionSet.options.find(option => option.id === selectedOptions[questionSet.id])?.recommendations}</p>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="navigation-buttons">
        <button onClick={handleBackClick} className="back-button">Back</button>
        <button onClick={handleNextClick} className="next-button">Next</button>
      </div>
    </div>
  );
}

export default AdminPanel;
