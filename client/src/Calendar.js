import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moonPhase, setMoonPhase] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {

    fetch('http://localhost:3001/api/moon-phase')
      .then(res => res.json())
      .then(data => setMoonPhase(data.phase))
      .catch(err => console.error('Failed to fetch moon phase', err));

    // Dummy Task Data
    const dummyTasks = [
      { date: '2025-04-10', title: 'Meeting' },
      { date: '2025-04-15', title: 'Project Due' },
      { date: '2025-04-20', title: 'Call Mom' }
    ];
    setTasks(dummyTasks);
  }, []);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty cells for the first week
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= numDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      const today = new Date();
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const dayTasks = tasks.filter(task => task.date === dateStr);

      days.push(
        <div key={dateStr} className={`day ${isToday ? 'today' : ''}`}>
          <strong>{day}</strong>
          {dayTasks.map((task, idx) => (
            <div key={idx} className="task">
              {task.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <h1>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h1>
        <p>Moon Phase Today: {moonPhase || 'Loading...'}</p>
      </div>
      <div className="calendar-grid">
        <div className="day-name">Sun</div>
        <div className="day-name">Mon</div>
        <div className="day-name">Tue</div>
        <div className="day-name">Wed</div>
        <div className="day-name">Thu</div>
        <div className="day-name">Fri</div>
        <div className="day-name">Sat</div>
        {generateCalendar()}
      </div>
    </div>
  );
};

export default Calendar;
