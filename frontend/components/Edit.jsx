const Edit = ({ handleSubmit, changedTask, handleTaskChange }) => {
  return (
    <form className="flex flex-col md:flex-row items-center justify-center" onSubmit={handleSubmit}>
      <input className="break-words border-2 rounded-md w-full" placeholder="Task" value={changedTask} onChange={handleTaskChange} required />
      <button
        type="submit"
        className="
              ml-2 text-xl cursor-pointer rounded-md m-2 pl-2 pr-2 from-green-500 
              to-pink-400 bg-gradient-to-b hover:to-pink-500 hover:from-green-600 font-pacifico
              "
      >
        Submit
      </button>
    </form>
  );
};

export default Edit;
