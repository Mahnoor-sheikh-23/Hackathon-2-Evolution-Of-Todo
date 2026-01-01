class Todo:
    """
    Represents a single todo item with id, title, description, and completion status.
    """
    _next_id = 1  # Class variable to keep track of the next available ID

    def __init__(self, title, description, completed=False):
        """
        Initialize a Todo instance.

        Args:
            title (str): The title of the todo
            description (str): The description of the todo
            completed (bool): Whether the todo is completed (default: False)
        """
        self.id = Todo._next_id
        Todo._next_id += 1
        self.title = title
        self.description = description
        self.completed = completed

    def __str__(self):
        """
        String representation of the Todo.

        Returns:
            str: Formatted string representation of the todo
        """
        status = "Completed" if self.completed else "Pending"
        return f"{self.id}. {self.title} - {self.description} [{status}]"