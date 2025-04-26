import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TodoList from './TodoList';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState({ temp: '', description: '' });

  useEffect(() => {
    axios.get('https://worldtimeapi.org/api/timezone/America/Chicago')
    .then(res => {
      const dateOnly = new Date(res.data.datetime).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setDate(dateOnly);
    })
    .catch(err => {
      console.error("Failed to get date:", err);
      setDate("Unavailable");
    });
  
    axios.get('/api/weather?city=Nashville')
      .then(res => {
        console.log(res.data); // optional
        setWeather({
          temp: res.data.temp,
          description: res.data.description
        });
      })
      .catch(() => {
        setWeather({
          temp: 'N/A',
          description: 'Unavailable'
        });
      });
  }, []);
  

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>To Do List App</h1>
        <p style={{ fontWeight: 'bold' }}>{date}<br></br> {weather.temp}°F and {weather.description}</p>
        
      </header>
      <BrowserRouter>
        <TodoList />
      </BrowserRouter>
      <footer>
        <p>&copy; 2025 To-Do List Application</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();