import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';
// changed <App />, and changed import
import TodoList from './TodoList'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <header>
        <h1>React App</h1>
        <div></div>
      </header>
      <BrowserRouter>
        <TodoList />
      </BrowserRouter>
      <footer>
        <p>&copy; 2025 Your Project Name</p>
      </footer>
    </div>


  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
