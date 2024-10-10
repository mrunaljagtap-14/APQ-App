import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AssessmentResult = () => {
    const location = useLocation(); // Get the state passed during navigation
    const { selectedOptions } = location.state || { selectedOptions: {} }; // Fallback to an empty object
    const [assessmentResults, setAssessmentResults] = useState([]);

    useEffect(() => {
        if (Object.keys(selectedOptions).length > 0) {
            fetchAssessments();
        }
    }, [selectedOptions]);

    const fetchAssessments = async () => {
        try {
            const promises = Object.entries(selectedOptions).map(async ([questionId, optionId]) => {
                const response = await fetch('http://localhost:5000/questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question_id: questionId, selected_option: optionId }),
                });
                const data = await response.json();
                return data;
            });

            const results = await Promise.all(promises);
            setAssessmentResults(results);
        } catch (error) {
            console.error('Error fetching assessments:', error);
        }
    };

    return (
        <div>
            <h1>Assessment Results</h1>
            {assessmentResults.length > 0 ? (
                <div>
                    {assessmentResults.map((result, index) => (
                        <div key={index}>
                            <h3>Question {index + 1}:</h3>
                            <p>{result.assess_text || 'No assessment found'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading assessments...</p>
            )}
        </div>
    );
};

export default AssessmentResult;
