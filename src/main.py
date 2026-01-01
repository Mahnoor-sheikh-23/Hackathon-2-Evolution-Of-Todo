from manager import TodoManager


def main():
    """
    Main function to run the Todo CLI application.
    """
    print("Todo Application")

    # Create a TodoManager instance
    todo_manager = TodoManager()

    while True:
        # Display menu options
        print("\nMenu:")
        print("1. Add Todo")
        print("2. View Todos")
        print("3. Update Todo")
        print("4. Delete Todo")
        print("5. Mark Todo Complete / Incomplete")
        print("6. Exit")

        # Get user choice
        choice = input("Enter your choice: ").strip()

        if choice == "1":
            # Add Todo
            title = input("Enter title: ").strip()
            description = input("Enter description: ").strip()

            if not title:
                print("Title cannot be empty!")
                continue

            todo = todo_manager.add_todo(title, description)
            print(f"Added todo: {todo}")

        elif choice == "2":
            # View Todos
            todos = todo_manager.get_all_todos()

            if not todos:
                print("No todos found.")
            else:
                print("\nAll Todos:")
                for todo in todos:
                    print(todo)

        elif choice == "3":
            # Update Todo
            try:
                todo_id = int(input("Enter todo ID to update: ").strip())
                todo = todo_manager.get_todo_by_id(todo_id)

                if not todo:
                    print(f"Todo with ID {todo_id} not found.")
                    continue

                title = input(f"Enter new title (current: {todo.title}): ").strip()
                if not title:
                    title = todo.title  # Keep current title if empty input
                description = input(f"Enter new description (current: {todo.description}): ").strip()

                if todo_manager.update_todo(todo_id, title, description):
                    print("Todo updated successfully.")
                else:
                    print("Failed to update todo.")

            except ValueError:
                print("Invalid ID. Please enter a number.")

        elif choice == "4":
            # Delete Todo
            try:
                todo_id = int(input("Enter todo ID to delete: ").strip())

                if todo_manager.delete_todo(todo_id):
                    print(f"Todo with ID {todo_id} deleted successfully.")
                else:
                    print(f"Todo with ID {todo_id} not found.")

            except ValueError:
                print("Invalid ID. Please enter a number.")

        elif choice == "5":
            # Mark Todo Complete / Incomplete
            try:
                todo_id = int(input("Enter todo ID to toggle status: ").strip())
                todo = todo_manager.get_todo_by_id(todo_id)

                if not todo:
                    print(f"Todo with ID {todo_id} not found.")
                    continue

                if todo_manager.toggle_todo_status(todo_id):
                    status = "completed" if todo.completed else "incomplete"
                    print(f"Todo with ID {todo_id} marked as {status}.")
                else:
                    print("Failed to toggle todo status.")

            except ValueError:
                print("Invalid ID. Please enter a number.")

        elif choice == "6":
            # Exit
            print("Goodbye!")
            break

        else:
            # Invalid choice
            print("Invalid choice. Please enter a number between 1-6.")


if __name__ == "__main__":
    main()