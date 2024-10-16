import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Define types for the task, filter, and actions
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type State = {
  tasks: Task[];
  filter: 'all' | 'completed' | 'incomplete';
};

type Action =
  | { type: 'ADD_TASK'; text: string }
  | { type: 'TOGGLE_TASK'; id: number }
  | { type: 'DELETE_TASK'; id: number }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'SET_FILTER'; filter: 'all' | 'completed' | 'incomplete' };

// Initial state
const initialState: State = {
  tasks: [],
  filter: 'all',
};

// Create context
const TodoContext = createContext<any>(null);

// Reducer function
function todoReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { id: Date.now(), text: action.text, completed: false }],
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
      };
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.tasks,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.filter,
      };
    default:
      return state;
  }
}

// Context Provider component
export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load tasks from localStorage when the app starts
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      dispatch({ type: 'SET_TASKS', tasks: JSON.parse(storedTasks) });
    }
  }, []);

  // Save tasks to localStorage whenever the task list changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the TodoContext
export const useTodos = () => useContext(TodoContext);
