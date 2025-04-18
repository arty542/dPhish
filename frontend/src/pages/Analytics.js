// src/pages/Analytics.js
import React, { useEffect, useState } from 'react';

const Analytics = () => {
  const [clicks, setClicks] = useState(0);
  const [visits, setVisits] = useState([]);
  const [time, setTime] = useState(new Date());

  // Simulate data collection
  useEffect(() => {
    const visitTime = new Date().toLocaleString();
    setVisits((prev) => [...prev, visitTime]);

    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    setClicks(clicks + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-indigo-600">📊 Analytics Dashboard</h1>
        <p className="text-gray-600 mb-2">Current time: {time.toLocaleTimeString()}</p>

        <div className="my-6">
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
          >
            Simulate User Action
          </button>
        </div>

        <div className="text-left mt-6">
          <p className="font-semibold">🖱️ Clicks:</p>
          <p className="text-lg mb-4">{clicks}</p>

          <p className="font-semibold">🕒 Visit Timestamps:</p>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {visits.map((visit, index) => (
              <li key={index}>{visit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
