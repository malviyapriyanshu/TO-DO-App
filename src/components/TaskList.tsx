import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TaskContainer = styled.div`
  margin-top: 20px;
`;

const TaskItem = styled.div<{ completed: boolean }>`
  background-color: ${(props) => (props.completed ? '#e8f7e8' : '#f7f7f7')};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskText = styled.span<{ completed: boolean }>`
  text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
  color: ${(props) => (props.completed ? '#888' : '#000')};
  cursor: pointer;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ff6b6b;
  margin-left: 10px;
`;

const EditInput = styled.input`
  padding: 5px;
  font-size: 16px;
`;

export const TaskList: React.FC<{
  tasks: { id: number; text: string; completed: boolean }[];
  toggleComplete: (id: number) => void;
  removeTask: (id: number) => void;
  editTask: (id: number, newText: string) => void;
}> = ({ tasks, toggleComplete, removeTask, editTask }) => {
  const [editMode, setEditMode] = useState<{ id: number; text: string } | null>(
    null
  );

  const handleEditSubmit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (editMode?.text) {
      editTask(id, editMode.text);
      setEditMode(null); // Exit edit mode after submitting
    }
  };

  return (
    <TaskContainer>
      {tasks.map((task) => (
        <TaskItem key={task.id} completed={task.completed}>
          {editMode && editMode.id === task.id ? (
            <form onSubmit={(e) => handleEditSubmit(e, task.id)}>
              <EditInput
                value={editMode.text}
                onChange={(e) => setEditMode({ id: task.id, text: e.target.value })}
              />
            </form>
          ) : (
            <TaskText
              completed={task.completed}
              onClick={() => toggleComplete(task.id)}
            >
              {task.text}
            </TaskText>
          )}
          <div>
            <IconButton onClick={() => setEditMode({ id: task.id, text: task.text })}>
              <FaEdit />
            </IconButton>
            <IconButton onClick={() => removeTask(task.id)}>
              <FaTrash />
            </IconButton>
          </div>
        </TaskItem>
      ))}
    </TaskContainer>
  );
};
