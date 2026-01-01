interface TaskFormProps {
  newTask: { title: string; description: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

export default function TaskForm({ newTask, onInputChange, onSubmit, submitButtonText = "Add Task" }: TaskFormProps) {
  // Validation logic
  const isTitleValid = newTask.title.trim().length >= 1 && newTask.title.trim().length <= 200;
  const isDescriptionValid = newTask.description.length <= 1000;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={newTask.title}
          onChange={onInputChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            isTitleValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          required
          minLength={1}
          maxLength={200}
        />
        {!isTitleValid && (
          <p className="mt-1 text-sm text-red-600">
            {newTask.title.trim().length === 0
              ? 'Title is required'
              : 'Title must be between 1 and 200 characters'}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={newTask.description}
          onChange={onInputChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            isDescriptionValid ? 'border-gray-300' : 'border-red-500'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          rows={3}
          maxLength={1000}
        />
        {!isDescriptionValid && (
          <p className="mt-1 text-sm text-red-600">
            Description must be less than 1000 characters
          </p>
        )}
      </div>
      <div>
        <button
          type="submit"
          disabled={!isTitleValid}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isTitleValid
              ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              : 'bg-gray-400 cursor-not-allowed'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}