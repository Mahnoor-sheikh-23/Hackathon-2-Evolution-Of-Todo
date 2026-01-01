import { Task } from '../lib/api';

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function TaskCard({ task, onToggleCompletion, onDeleteTask }: TaskCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
          />
          <div className="ml-3">
            <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              Created: {new Date(task.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}