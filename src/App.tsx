import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskList } from './components/TaskList';
import { TaskInput } from './components/TaskInput';
import { SearchBar } from './components/SearchBar';

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to right, #c2e59c, #64b3f4);
  padding: 20px;
`;

const TodoContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TabButton = styled.button<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#4caf50' : '#f0f0f0')};
  color: ${(props) => (props.active ? 'white' : 'black')};
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
`;

const UndoRedoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const UndoRedoButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #f0f0f0;
  color: black;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Brush teeth', completed: true },
    { id: 2, text: 'Buy groceries 🛒', completed: false },
    { id: 3, text: 'Pay rent 💵', completed: false },
    { id: 4, text: 'Clean room 🧹', completed: true },
  ]);

  const [history, setHistory] = useState([{ tasks }]); // Store history for undo/redo
  const [currentIndex, setCurrentIndex] = useState(0); // Track current history index
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Utility to save the current task state in history for undo-redo
  const saveHistory = (newTasks: any) => {
    const newHistory = history.slice(0, currentIndex + 1); // Remove "future" states
    setHistory([...newHistory, { tasks: newTasks }]);
    setCurrentIndex(newHistory.length);
  };

  const addTask = (text: string) => {
    const newTasks = [...tasks, { id: tasks.length + 1, text, completed: false }];
    setTasks(newTasks);
    saveHistory(newTasks);
  };

  const toggleComplete = (id: number) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveHistory(newTasks);
  };

  const removeTask = (id: number) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    saveHistory(newTasks);
  };

  const editTask = (id: number, newText: string) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(newTasks);
    saveHistory(newTasks);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTasks(history[currentIndex - 1].tasks);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTasks(history[currentIndex + 1].tasks);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'incomplete') return !task.completed;
      return true;
    })
    .filter((task) => task.text.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AppContainer>
      <TodoContainer>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TabsContainer>
          <TabButton active={filter === 'all'} onClick={() => setFilter('all')}>
            All
          </TabButton>
          <TabButton
            active={filter === 'completed'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </TabButton>
          <TabButton
            active={filter === 'incomplete'}
            onClick={() => setFilter('incomplete')}
          >
            Incomplete
          </TabButton>
        </TabsContainer>
        <TaskList
          tasks={filteredTasks}
          toggleComplete={toggleComplete}
          removeTask={removeTask}
          editTask={editTask}
        />
        <TaskInput addTask={addTask} />
        <UndoRedoContainer>
          <UndoRedoButton onClick={undo} disabled={currentIndex === 0}>
            Undo
          </UndoRedoButton>
          <UndoRedoButton
            onClick={redo}
            disabled={currentIndex === history.length - 1}
          >
            Redo
          </UndoRedoButton>
        </UndoRedoContainer>
      </TodoContainer>
    </AppContainer>
  );
}

export default App;
