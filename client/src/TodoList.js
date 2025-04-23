import "./TodoList.css"
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import AddProject from "./AddProject";
import ProjectInstance from "./ProjectInstance";
import AddTask from "./AddTask";
import TaskInstance from "./TaskInstance";

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
                    <Route path="/project/:id/add-task" element={<AddTask />}/>
                    <Route path="/project/:id/:taskId" element={<TaskInstance />}/>
                </Routes>
            </div>
        </>
    );
};

export default ToDoList;