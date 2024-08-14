import axios from 'axios';
import React, { useState, useEffect } from "react";

// Define the API Base URL
const API_BASE_URL = 
  window.location.hostname === 'localhost'
  ? 'http://localhost:5000/tasks'  // Development URL
  : 'https://to-do-list-reach.vercel.app/api/tasks';  // Production URL

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        axios.get(API_BASE_URL)
            .then((response) => setTasks(response.data))
            .catch((error) => console.error('Error fetching tasks:', error));
    }, []);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            axios.post(API_BASE_URL, { text: newTask })
                .then((response) => {
                    setTasks((prevTasks) => [...prevTasks, response.data]);
                    setNewTask("");
                })
                .catch((error) => console.error('Error adding task:', error));
        }
    }

    function deleteTask(id) {
        axios.delete(`${API_BASE_URL}/${id}`)
            .then(() => {
                setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
            })
            .catch((error) => console.error('Error deleting task:', error));
    }

    function moveTaskUp(id) {
        axios.put(`${API_BASE_URL}/${id}/move-up`)
            .then(() => {
                setTasks((prevTasks) => {
                    const index = prevTasks.findIndex((task) => task._id === id);
                    if (index > 0) {
                        const updatedTasks = [...prevTasks];
                        [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
                        return updatedTasks;
                    }
                    return prevTasks;
                });
            })
            .catch((error) => console.error('Error moving task up:', error));
    }

    function moveTaskDown(id) {
        axios.put(`${API_BASE_URL}/${id}/move-down`)
            .then(() => {
                setTasks((prevTasks) => {
                    const index = prevTasks.findIndex((task) => task._id === id);
                    if (index < prevTasks.length - 1) {
                        const updatedTasks = [...prevTasks];
                        [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
                        return updatedTasks;
                    }
                    return prevTasks;
                });
            })
            .catch((error) => console.error('Error moving task down:', error));
    }

    return (
        <div className="to-do-list">
            <h1>To-Do List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter a task..."
                    value={newTask}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={addTask}>
                    Add
                </button>
            </div>
            <ol>
                {tasks.map((task, index) => (
                    <li key={task._id}>
                        <span className="text">{task.text}</span>
                        <button className="delete-button" onClick={() => deleteTask(task._id)}>
                            Delete
                        </button>
                        <button className="move-button" onClick={() => moveTaskUp(task._id)} disabled={index === 0}>
                            ☝️
                        </button>
                        <button className="move-button" onClick={() => moveTaskDown(task._id)} disabled={index === tasks.length - 1}>
                            👇
                        </button>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default ToDoList;
