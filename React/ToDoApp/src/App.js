import logo from './logo.svg';
import './App.css';
import { useState } from "react"

function App() {
  const [toDos, setTodos] = useState([])
  const [toDo, setTodo] = useState("")
  return (
    <div className="app">
      <div className="mainHeading">
        <h1>ToDo List</h1>
      </div>
      <div className="subHeading">
        <br />
        <h2>Whoop, it's Wednesday 🌝 ☕ </h2>
      </div>
      <div className="input">
        <input value={toDo} onChange={(e) => {
          setTodo(e.target.value)
        }} type="text" placeholder="🖊️ Add item..." />
        <i onClick={() => {
          setTodos([...toDos, { id: Date.now(), text: toDo, status: false }])
          setTodo("")
        }} className="fas fa-plus"></i>
      </div>
      <div className="todos">
        {
          toDos.map((object) => {
            return (
              <div className="todo">
                <div className="left">
                  <input type="checkbox" name="" id="" value={object.status} onChange={(e) => {
                    setTodos(toDos.filter((object1) => {
                      if (object.id == object1.id) {
                        object1.status = e.target.checked
                      }
                      return object1
                    }))
                  }} />
                  <p>{object.text}</p>
                </div>
                <div className="right">
                  <i className="fas fa-times" onClick={(e) => {
                    setTodos(toDos.filter((object1) => {
                      if (object.id != object1.id) {
                        return object1
                      }
                    }))
                  }}></i>
                </div>
              </div>
            )
          })
        }
        {toDos.map((obj) => {
          if (obj.status) {
            return (<h1>{obj.text}</h1>)
          }
        })}
      </div>
    </div>
  );
}

export default App;
