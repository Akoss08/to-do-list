import { useEffect, useState } from 'react';
import api from './api/todos';

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
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

    getTodos();
  }, []);

  return (
    <>
      {todos && (
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="flex items-center flex-col gap-5">
            {todos.map((todo) => (
              <div>
                <h1 className="text-blue-300">{todo.id}</h1>
                <h1 className="text-pink-300">Something</h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
