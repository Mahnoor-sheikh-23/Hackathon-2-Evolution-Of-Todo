from todo import Todo


class TodoManager:
    """
    Manages the collection of Todo items in memory.
    """

    def __init__(self):
        """
        Initialize the TodoManager with an empty list of todos.
        """
        self.todos = []

    def add_todo(self, title, description):
        """
        Add a new todo to the collection.

        Args:
            title (str): The title of the todo
            description (str): The description of the todo

        Returns:
            Todo: The newly created Todo instance
        """
        todo = Todo(title, description)
        self.todos.append(todo)
        return todo

    def get_all_todos(self):
        """
        Get all todos in the collection.

        Returns:
            list: List of all Todo instances
        """
        return self.todos

    def get_todo_by_id(self, todo_id):
        """
        Get a specific todo by its ID.

        Args:
            todo_id (int): The ID of the todo to retrieve

        Returns:
            Todo: The Todo instance with the specified ID, or None if not found
        """
        for todo in self.todos:
            if todo.id == todo_id:
                return todo
        return None

    def update_todo(self, todo_id, title, description):
        """
        Update an existing todo's title and description.

        Args:
            todo_id (int): The ID of the todo to update
            title (str): The new title
            description (str): The new description

        Returns:
            bool: True if the todo was updated, False if not found
        """
        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.title = title
            todo.description = description
            return True
        return False

    def delete_todo(self, todo_id):
        """
        Delete a todo by its ID.

        Args:
            todo_id (int): The ID of the todo to delete

        Returns:
            bool: True if the todo was deleted, False if not found
        """
        todo = self.get_todo_by_id(todo_id)
        if todo:
            self.todos.remove(todo)
            return True
        return False

    def toggle_todo_status(self, todo_id):
        """
        Toggle the completion status of a todo.

        Args:
            todo_id (int): The ID of the todo to toggle

        Returns:
            bool: True if the status was toggled, False if not found
        """
        todo = self.get_todo_by_id(todo_id)
        if todo:
            todo.completed = not todo.completed
            return True
        return False