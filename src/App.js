import { useReducer, useState } from "react";
import "./styles.css";

const Actions = {
  ADD_TODO: "ADD_TODO",
  TOGGLE_TODO: "TOGGLE_TODO",
  UPDATE_TODO: "UPDATE_TODO",
  DELETE_TODO: "DELETE_TODO"
};

const reducer = (todos, action) => {
  switch (action.type) {
    case Actions.ADD_TODO:
      return [addTodo(action.payload.name), ...todos];
    case Actions.TOGGLE_TODO: {
      const id = action.payload.id;
      return todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    }
    case Actions.UPDATE_TODO: {
      const { id, name } = action.payload;
      return todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, name: name };
        }
        return todo;
      });
    }
    case Actions.DELETE_TODO:
      return todos.filter((todo) => todo.id !== action.payload.id);
    default:
      return todos;
  }
};

const addTodo = (todo) => {
  return { id: crypto.randomUUID(), name: todo, isComplete: false };
};

export default function App() {
  const [input, setInput] = useState("");
  const [todos, dispatch] = useReducer(reducer, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!input) return;

    dispatch({ type: Actions.ADD_TODO, payload: { name: input } });
    setInput("");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo and press enter"
          style={{ width: "50%", padding: ".5rem" }}
        />
      </form>
      <hr />

      {todos.map((todo) => {
        return <Todo key={todo.id} todo={todo} dispatch={dispatch} />;
      })}
    </>
  );
}

export const Todo = ({ todo, dispatch }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editInput, setEditInput] = useState(todo.name);

  const handleUpdate = () => {
    dispatch({
      type: Actions.UPDATE_TODO,
      payload: { ...todo, name: editInput }
    });
    setIsEditMode(false);
  };

  return (
    <>
      <div className={`todo ${todo.isComplete ? "completed" : ""}`}>
        <input
          type="checkbox"
          onClick={() =>
            dispatch({ type: Actions.TOGGLE_TODO, payload: { id: todo.id } })
          }
        />
        {isEditMode ? (
          <>
            <input
              type="text"
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
            />
            <span className="edit" onClick={() => handleUpdate()}>
              [update]
            </span>
          </>
        ) : (
          <span className="description">{todo.name}</span>
        )}
        {!isEditMode && (
          <span className="edit" onClick={() => setIsEditMode((prev) => !prev)}>
            [edit]
          </span>
        )}
        <span
          className="delete"
          onClick={() =>
            dispatch({ type: Actions.DELETE_TODO, payload: { id: todo.id } })
          }
        >
          [delete]
        </span>
      </div>
    </>
  );
};
