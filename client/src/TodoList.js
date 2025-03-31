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
            <div>
                <h2 className="page-title">Projects: </h2>

                <div className="projects-container">
                {project.map((data) => (
                    <p className="project-instance" key={data.id}><a className="project-name" href="emptylink">{data.name}</a><button className="edit-project">edit</button><button className="delete-project">delete</button></p>
                ))}
                </div>

                <button id="add-project">Add Project</button>
            </div>
        </>
    );
}

export default TodoList;
// project for now will be just an empty link