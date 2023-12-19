import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      saveTasksToLocalStorage([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    } else {
      setError('Input bo\'sh bo\'lmasligi kerak!');
      openModal();
    }
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const startEditing = (taskId, taskText) => {
    setEditingTaskId(taskId);
    setEditedTaskText(taskText);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditedTaskText('');
  };

  const saveEditedTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTaskId ? { ...task, text: editedTaskText } : task
    );
    setTasks(updatedTasks);
    setEditingTaskId(null);
    setEditedTaskText('');
    saveTasksToLocalStorage(updatedTasks);
  };

  const saveTasksToLocalStorage = (updatedTasks) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOkButtonClick = () => {
    closeModal();
  };

  return (
    <div className="App">
      <h1>React To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <button onClick={saveEditedTask}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
                <div className="task-actions">
                  <button onClick={() => toggleCompletion(task.id)}>
                    {task.completed ? 'Undo' : 'Check'}
                  </button>
                  <button onClick={() => startEditing(task.id, task.text)}>Edit</button>
                  <button onClick={() => removeTask(task.id)}>Remove</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className="modal">
          <p>{error}</p>
          <button onClick={handleOkButtonClick}>OK</button>
        </div>
      )}
    </div>
  );
}

export default App;
