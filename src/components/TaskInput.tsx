import React, { useState } from 'react';
import styled from 'styled-components';

const TaskInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const AddButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

export const TaskInput: React.FC<{ addTask: (text: string) => void }> = ({ addTask }) => {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      addTask(taskText);
      setTaskText('');
    }
  };

  return (
    <TaskInputContainer>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Type something..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <AddButton type="submit">Add Task</AddButton>
      </form>
    </TaskInputContainer>
  );
};
