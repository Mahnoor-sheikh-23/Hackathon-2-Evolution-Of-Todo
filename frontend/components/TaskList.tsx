import { Task } from '../lib/api';

interface TaskListProps {
  tasks: Task[];
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function TaskList({ tasks, onToggleCompletion, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks yet. Add your first task!</p>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="border border-gray-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleCompletion(task.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {task.title}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onDeleteTask(task.id)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
          {task.description && (
            <p className="ml-7 mt-1 text-sm text-gray-500">{task.description}</p>
          )}
          <p className="ml-7 mt-1 text-xs text-gray-400">
            Created: {new Date(task.created_at).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}