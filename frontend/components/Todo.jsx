import getDate from '../src/utilities/dateFormatter';
import { FaEdit } from 'react-icons/fa';
import { ImBin } from 'react-icons/im';
import { useState } from 'react';
import api from '../src/api/todos';
import Edit from './Edit';

export default function Todo({ task, date, is_done, id, refresh }) {
  const [checked, setChecked] = useState(is_done);
  const [clicked, setClicked] = useState(false);
  const [changedTask, setChangedTask] = useState(task);

  async function handleChange() {
    try {
      await api.patch(`/${id}`, { is_done: !checked });
      setChecked(!checked);
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

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await api.patch(`/${id}`, { to_do: changedTask });
      setClicked(false);
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

  async function handleDelete() {
    try {
      await api.delete(`/${id}`);
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
    <div
      className="
    flex flex-col gap-2 items-center w-3/4 m-3 from-violet-300 rounded-xl bg-gradient-to-b
    "
    >
      <h1
        className={`
        m-5 ${checked && 'line-through'} font-serif font-bold text-xl text-center
        `}
      >
        {getDate(date)}
      </h1>

      <div className="flex flex-col md:flex-row items-center w-3/4 p-2">
        {clicked ? (
          <Edit handleSubmit={handleSubmit} changedTask={changedTask} handleTaskChange={(e) => setChangedTask(e.target.value)} />
        ) : (
          <>
            <h1
              className={`
              w-1/2 break-words ${checked && 'line-through'} text-center font-playwrite-it
              `}
            >
              {changedTask}
            </h1>{' '}
            <div
              className="
            flex flex-col md:flex-row items-center justify-center w-1/2 gap-1 md:ml-5 mt-5 md:mt-0
            "
            >
              <label className="flex">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={handleChange}
                  className="
                  h-[1.125rem] w-[1.125rem] border-2 rounded-md accent-green-600 hover:accent-red-500
                  cursor-pointer
                  "
                />
              </label>
              <FaEdit className="ml-2 text-xl cursor-pointer" onClick={() => setClicked(true)} />
              <ImBin className="ml-2 text-xl cursor-pointer" onClick={handleDelete} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
