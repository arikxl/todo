import { useState, useEffect } from 'react';

import './App.css';

const API_BASE = 'http://localhost:5000';
// const API_BASE = 'https://todo-arik.herokuapp.com'

function App() {

  const [todos, setTodos] = useState([] );
  const [newTodo, setNewTodo] = useState('')
  const [popUpActive, setPopUpActive] = useState(false);
  
  useEffect(() => {
    
    getTodos();
    JSON.parse(localStorage.getItem('todos'))
  }, [])

  const setTodosForDisplay = (todos) => {
    setTodos(todos)
    localStorage.setItem('todos', JSON.stringify(todos))
  }
  
  const getTodos = () => {
    fetch(API_BASE + '/todos')
    .then(res => res.json())
    .then(data => setTodosForDisplay(data))
    .catch(err => console.error("ERROR:", err))
  }

  const completeTodo = async (id) => {
    const data = await fetch(`${API_BASE}/todo/complete/${id}`)
    .then(res => res.json());

    setTodosForDisplay(todos => todos.map(todo =>  {
      if(todo._id === data._id){
        todo.isCompleted = data.isCompleted
      }
      return todo
    }));
  };
  
  const deleteTodo = async (id) => {
    const data = await fetch(`${API_BASE}/todo/delete/${id}`,
    { method: 'DELETE' })
    .then(res => res.json());

    setTodosForDisplay(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addTodo = async () => {
    const data = await fetch(`${API_BASE}/todo/new`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: newTodo
      })
    }).then(res => res.json())
    
    setTodos([...todos, data]);
    setPopUpActive(false);
    setNewTodo('');
  }


  return (
    <>
    <div className="App">
        <h1>Welcome Arik</h1>
        <h4>Your Todos:</h4>

        <div className="todos">
          {todos.length > 0 ? todos.map(todo =>(
            <div className={`todo ${(todo.isCompleted && "is-complete")}`}
             onClick={() => completeTodo(todo._id)}
             key={todo._id}>
              <div className="checkbox"></div>

              <div className="title">{todo.title}</div>

              <div className="delete-todo"
              onClick={()=> deleteTodo(todo._id) }>X</div>
            </div>
          )) : <p>You currently have no todos</p>}
        </div>
        <div className="addPopup"
            onClick={()=> setPopUpActive(true)}>
            +
          </div>

          {popUpActive && (
            <div className="popup">
                <div className="close-popup" onClick={()=> setPopUpActive(false)}>
                  X</div>
                  <div className="content">
                    <h3>Add todo</h3>
                    <input type="text"
                    className="add-todo-input"
                    onChange={e => setNewTodo(e.target.value)}
                    value={newTodo}/>
                    <div className="button"
                          onClick={addTodo}
                    >create Todo</div>
                  </div>
            </div>
          ) }
    </div>
    </>
  );
}

export default App;
