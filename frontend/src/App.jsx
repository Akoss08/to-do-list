import { useEffect, useState } from 'react';
import api from './api/todos';
import Todo from '../components/Todo';
import Form from '../components/Form';

export default function App() {
  const [todos, setTodos] = useState([]);

  async function getTodos() {
    try {
      const response = await api.get();
      setTodos(response.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log(`Error: ${error.message}`);
      }
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <div className="sm:h-screen w-screen flex justify-center items-center">
        <div
          className="
            flex grow sm:grow-0 items-center flex-col rounded-xl w-1/3 max-h-3/4 overflow-y-auto 
            no-scrollbar bg-violet-400 shadow-[0_0px_50px_rgba(28,25,23,0.8)] scroll-gradient
          "
        >
          <Form refresh={getTodos} />
          {todos && todos.map((todo) => <Todo key={todo.id} task={todo.to_do} date={todo.creation_time} is_done={todo.is_done} id={todo.id} refresh={getTodos} />)}
        </div>
      </div>
    </>
  );
}
