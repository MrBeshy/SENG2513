import "./TodoList.css"
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import AddProject from "./AddProject";
import ProjectInstance from "./ProjectInstance";

const ToDoList =() => {
    return(
        <>
            <div>
                <Link to="/" className="hide">Projects</Link>
                <Link to="/AddProject" className="hide">AddProject</Link>
                <Routes>
                    <Route path="*" element={<Projects />} />
                    <Route path="/AddProject" element={<AddProject />} />
                    <Route path="/project/:id" element={<ProjectInstance />} />
                </Routes>
            </div>

                <button id="add-project">Add Project</button>
            {/* </div> */}
        </>
    );
};

export default ToDoList;