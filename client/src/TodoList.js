//import "./TooList.css"
import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import Projects from "./Projects";
import AddProject from "./AddProject";

const ToDoList =() => {
    return(
        <>
            <div>
                <Link to="/">Projects</Link>
                <Link to="/AddProject">AddProject</Link>
                <Routes>
                    <Route path="*" element={<Projects />} />
                    <Route path="/AddPRoject" element={<AddProject />} />
                </Routes>
            </div>

                <button id="add-project">Add Project</button>
            {/* </div> */}
        </>
    );
};

export default ToDoList;