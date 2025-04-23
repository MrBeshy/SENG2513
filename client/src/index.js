import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TodoList from './TodoList';
//import Calendar from './Calendar';
import axios from 'axios';

const App = () => {
  const [date, setDate] = useState('');

  useEffect(() => {
    axios.get('http://worldtimeapi.org/api/timezone/America/New_York')
      .then((res) => {
        const datetime = new Date(res.data.datetime).toLocaleDateString();
        setDate(datetime);
      })
      .catch((err) => {
        console.error("Error fetching time:", err);
        setDate("Unable to load time");
      });
  }, []);

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
        <h1>To Do List App</h1>
        <p style={{ fontWeight: 'bold' }}>{date}</p>
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
