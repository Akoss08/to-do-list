import React, { useState } from 'react';
import api from '../src/api/todos';

const Form = ({ refresh }) => {
  const [newTask, setNewTask] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post('', { to_do: newTask });
      setNewTask('');
      refresh();
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

  return (
    <form
      className="
    flex flex-col md:flex-row items-center justify-center max-w-3/4
    "
      onSubmit={handleSubmit}
    >
      <input
        value={newTask}
        type="text"
        className="
      border-2 p-1 m-2 rounded-md w-full
      "
        placeholder="Add a new task"
        onChange={(e) => setNewTask(e.target.value)}
        required
      />
      <button
        type="submit"
        className="
      w-1/4 m-2 rounded-md p-1 w-1/3 break-words cursor-pointer from-sky-500 
      to-orange-400 bg-gradient-to-b hover:to-sky-600 hover:from-orange-500 font-pacifico"
      >
        Add
      </button>
    </form>
  );
};

export default Form;
