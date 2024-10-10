import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../Graph.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use location to get passed state
  const [weightages, setWeightages] = useState(location.state?.weightages || []); // Use passed weightages

  // UseEffect to handle weightages in case of re-render
  useEffect(() => {
    if (location.state?.weightages) {
      setWeightages(location.state.weightages);
    }
  }, [location.state]);

  const labelsInfo = [
    'Product Feature Maturity',
    'Organizational Test Maturity',
    'Application Lifecycle Management',
    'Automation Maturity',
    'Performance Maturity',
  ];

  // Ensure weightage values are within a valid range (0-5)
  const ratings = labelsInfo.map((label, index) => Math.max(0, weightages[index] || 0)); // Default to 0

  const maxValue = 5;

  const chartData = {
    labels: labelsInfo,
    datasets: [
      {
        label: 'Maturity Weightage',
        data: ratings,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: maxValue,
        ticks: {
          stepSize: 1,
        },
        grid: {
          color: '#e0e0e0',
        },
        pointLabels: {
          font: {
            size: 16,
            family: 'Arial',
            weight: 'bold',
          },
          color: '#333',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const handleAssessmentClick = () => {
    navigate('/assessmentresults');
  };

  return (
    <div className="chart-container">
      <h1 className="chart-heading">Assessment and Roadmap</h1>
      <div style={{ width: '900px', height: '400px', margin: '0 auto' }}>
        <Radar data={chartData} options={options} />
      </div>
      <div className="button-container">
        <button className="chart-button" onClick={handleAssessmentClick}>Assessment</button>
        <button className="chart-button">Recommendation</button>
      </div>
    </div>
  );
};

export default ChartComponent;
