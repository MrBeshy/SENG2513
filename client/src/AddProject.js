import "./AddProject.css";
import React from "react";
import TodoList from "./TodoList";
import { Link, Routes, Route } from "react-router-dom";
//import { useEffect, useState } from "react";

const AddProject = () => {
    return(
        <>
            <div className="add-project-page">
                <h2 className="page-title">Add Project: </h2>
                <form>
                    <input type="text" placeholder="project name"></input>
                    <input type="text" placeholder="project description"></input>
                    <input type="date" placeholder="mm/dd/yyyy"></input>
                </form>
                <button type="submit" id="save-project">Save</button>
                <button id="cancel"><Link to="/TodoList">Cancel</Link></button>
                <Routes><Route path="/TodoList" element={<TodoList />}/></Routes>
            </div>
        </>
    );
}

export default AddProject;