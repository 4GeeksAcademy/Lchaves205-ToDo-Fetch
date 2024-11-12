import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [inputValue, setInputValue] = useState(""); 
    const [todos, setTodos] = useState([]); 
    const [userName, setUserName] = useState(""); 
    const [isUserCreated, setIsUserCreated] = useState(false); 

    
    const createUser = async (userName) => {
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([]) 
            });
            if (response.ok) {
                console.log("User created successfully");
                setIsUserCreated(true);
                getTodos(); 
            } else {
                console.log('Failed to create user:', response.status);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    
    const getTodos = async () => {
        if (!userName) return; 
        
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                const data = await response.json();
                setTodos(data.todos || []); 
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.log("Error:", error);
        }
    };

   
    const updateTodosOnServer = async (updatedTodos) => {
        if (!userName) return; 
        
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ todos: updatedTodos })
            });
            if (response.ok) {
                console.log("Todos updated on server");
            } else {
                console.log("Failed to update todos:", response.status);
            }
        } catch (error) {
            console.log("Error updating todos:", error);
        }
    };

  
    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = { label: inputValue, is_done: false };
            const updatedTodos = [...todos, newTodo];
            setTodos(updatedTodos);
            updateTodosOnServer(updatedTodos); 
            setInputValue(""); 
        }
    };

 
    const deleteTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
        updateTodosOnServer(updatedTodos); 
    };

    const clearAllTasks = async () => {
        if (!userName) return;
        
        try {
            const response = await fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                console.log("User and tasks deleted");
                setTodos([]); 
                setUserName(""); 
                setIsUserCreated(false); 
            } else {
                console.log("Failed to delete user:", response.status);
            }
        } catch (error) {
            console.log("Error deleting user:", error);
        }
    };

  
    const handleUserCreation = () => {
        if (userName.trim()) {
            createUser(userName); 
        }
    };

    
    useEffect(() => {
        if (userName && isUserCreated) {
            getTodos();
        }
    }, [userName, isUserCreated]); 

    return (
        <div className="card text-center mt-5" style={{ width: "40rem" }}>
            {!isUserCreated ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <button onClick={handleUserCreation}>Create User</button>
                </div>
            ) : (
                <div>
                    <span className="title">todos for {userName}</span>

                    <input
                        type="text"
                        placeholder="Enter task"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addTodo(); 
                        }}
                    />
                    <button onClick={addTodo}>Add Task</button>

                    <ul className="list-group list-group-flush ms-5 me-5 mb-5 border border-start border-end">
                        {todos.length === 0 ? (
                            <li className="list-group-item tasks d-flex ps-5 text-secondary">No tasks, add tasks</li>
                        ) : (
                            todos.map((item, index) => (
                                <li key={index} className="list-group-item todo-item d-flex ps-5 text-secondary">
                                    {item.label}
                                    <button
                                        className="remove text-success"
                                        onClick={() => deleteTodo(index)}
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

                    <button onClick={clearAllTasks}>Clear All Tasks</button>
                    <button onClick={clearAllTasks}>Clear User</button> {}
                </div>
            )}
        </div>
    );
};

export default TodoList;
