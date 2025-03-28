// Projects.jsx

import "./TodoList.css";
import React from "react";
import { useEffect, useState } from "react";

const TodoList = () => {

    const [project, setproject] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        fetch(`/api/project`)
        .then((res) => {
            console.log("Response status:", res.status);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            setproject(data); // Ensure data is an array
            setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <>
            <div className="app-name">
                <h1>To-Do List App</h1>
            </div>
            <div>
                <p>Projects: </p>
                
                <button id="add-project">Add Project</button>

                <div className="projects-container">
                {project.map((data) => (
                    <p key={data.id}>{data.name}</p>
                ))}
                </div>
            </div>
        </>
    );
}

export default TodoList;