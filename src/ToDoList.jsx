import React, { useState, useEffect } from "react";

const API_BASE_URL_Local = 'http://localhost:5000/tasks';
const API_BASE_URL_Vercel = 'api/server/tasks';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");


    useEffect(() => {
        fetch(API_BASE_URL_Vercel)
            .then((response) => response.json())
            .then((data) => setTasks(data));
    }, []);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            fetch(API_BASE_URL_Vercel, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newTask }),
            })
                .then((response) => response.json())
                .then((newTask) => {
                    setTasks((prevTasks) => [...prevTasks, newTask]);
                    setNewTask("");
                });
        }
    }

    function deleteTask(id) {
        fetch(`${API_BASE_URL_Vercel}/${id}`, {
            method: "DELETE",
        }).then(() => {
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        });
    }

    function moveTaskUp(id) {
        fetch(`${API_BASE_URL_Vercel}/${id}/move-up`, {
            method: "PUT",
        }).then(() => {
            setTasks((prevTasks) => {
                const index = prevTasks.findIndex((task) => task._id === id);
                if (index > 0) {
                    const updatedTasks = [...prevTasks];
                    [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
                    return updatedTasks;
                }
                return prevTasks;
            });
        });
    }

    function moveTaskDown(id) {
        fetch(`${API_BASE_URL_Vercel}/${id}/move-down`, {
            method: "PUT",
        }).then(() => {
            setTasks((prevTasks) => {
                const index = prevTasks.findIndex((task) => task._id === id);
                if (index < prevTasks.length - 1) {
                    const updatedTasks = [...prevTasks];
                    [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
                    return updatedTasks;
                }
                return prevTasks;
            });
        });
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
