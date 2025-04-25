import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TodoList from './TodoList';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState('');
  const [moonEmoji, setMoonEmoji] = useState('');
  const [moonPhase, setMoonPhase] = useState('');

  useEffect(() => {
    // Get the date
    axios.get('https://worldtimeapi.org/api/timezone/Europe/London')
      .then(res => {
        const formatted = new Date(res.data.datetime).toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        setDate(formatted);
      })
      .catch(err => {
        console.error("Failed to get date:", err);
        setDate("Unavailable");
      });

    // Get moon data from your server
    axios.get('/api/json/moonphase')
      .then(res => {
        setMoonEmoji(res.data.emoji);
        setMoonPhase(res.data.phase);
      })
      .catch(err => {
        console.error("Moon API error:", err);
        setMoonEmoji("🌕");
        setMoonPhase("Unknown");
      });
  }, []);

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>To Do List App</h1>
        <p style={{ fontWeight: 'bold' }}>{date} {moonEmoji} ({moonPhase})</p>
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