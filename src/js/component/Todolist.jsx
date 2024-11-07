import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);
    const [userName, setUserName] = useState(""); // State for user name

    const createUser = async (userName) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return true;
            } else {
                console.log('Failed to create user:', response.status);
                return false;
            }
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    const getTodos = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Lchaves205", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.status === 404) {
                // If no user is found, create user
                createUser("Lchaves205"); // Replace with your dynamic user logic if needed
            }
            const data = await response.json();
            setTodos(data.todos);
            return true;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    const createTodo = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/Lchaves205", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "label": inputValue,
                    "is_done": false,
                }),
            });

            const data = await response.json();
            getTodos();
            setInputValue("");
            return true;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/todos/" + id, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log(data);
            getTodos();
            return true;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    const deleteUser = async () => {
        try {
            const response = await fetch("https://playground.4geeks.com/todo/users/Lchaves205", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            console.log(data);
            setTodos([]); // Clear the tasks locally after deleting the user
            return true;
        } catch (error) {
            console.log("Error: ", error);
            return false;
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    return (
        <div className="card text-center mt-5" style={{ width: "40rem" }}>
            <span className="title">todos</span>
            {/* Add a field to create a new user */}
            <div>
                <input
                    type="text"
                    placeholder="Enter new user name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && userName.trim()) {
                            createUser(userName); // Call the API to create the user
                            setUserName(""); // Clear the input after creating the user
                        }
                    }}
                />
                <button onClick={() => createUser(userName)}>Create User</button>
            </div>

            {/* Button to delete user and all tasks */}
            <div>
                <button onClick={deleteUser}>Delete User and Tasks</button>
            </div>

            <ul className="list-group list-group-flush ms-5 me-5 mb-5 border border-start border-end">
                <li className="box list-group-item border border-top">
                    <input
                        className="d-flex ms-4 border-0"
                        type="text"
                        onChange={(e) => setInputValue(e.target.value)}
                        value={inputValue}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && inputValue.trim()) {
                                createTodo();
                            }
                        }}
                        placeholder="Input task"
                    />
                </li>
                {todos.length === 0 ? (
                    <li className="list-group-item tasks d-flex ps-5 text-secondary">No tasks, add tasks</li>
                ) : (
                    todos.map((item) => (
                        <li key={item.id} className="list-group-item todo-item d-flex ps-5 text-secondary">
                            {item.label}
                            <button
                                className="remove text-success"
                                onClick={() => deleteTodo(item.id)}
                            >
                                X
                            </button>
                        </li>
                    ))
                )}
                <li className="itemcounter list-group-item d-flex ms-0 text-secondary">
                    {todos.length} item(s) left
                </li>
            </ul>
        </div>
    );
};

export default TodoList;
