# Quickstart Guide: Todo CLI Application - Phase I

## Running the Application

1. Ensure Python 3.13 or higher is installed on your system
2. Navigate to the project root directory
3. Run the application with the following command:
   ```bash
   python src/main.py
   ```

## Using the Application

1. The application will display a menu with numbered options:
   ```
   Todo Application
   1. Add Todo
   2. View Todos
   3. Update Todo
   4. Delete Todo
   5. Mark Todo Complete / Incomplete
   6. Exit
   ```

2. Enter the number corresponding to the action you want to perform
3. Follow the prompts to provide necessary information
4. The menu will reappear after each operation until you choose to exit

## Example Usage

### Adding a Todo
1. Select option 1 (Add Todo)
2. Enter a title for your todo
3. Enter a description for your todo
4. The system will confirm the todo has been added with an assigned ID

### Viewing Todos
1. Select option 2 (View Todos)
2. The system will display all todos with their ID, title, description, and completion status

### Updating a Todo
1. Select option 3 (Update Todo)
2. Enter the ID of the todo you want to update
3. Enter the new title and description
4. The system will confirm the update

### Deleting a Todo
1. Select option 4 (Delete Todo)
2. Enter the ID of the todo you want to delete
3. The system will confirm the deletion

### Marking Todo Complete/Incomplete
1. Select option 5 (Mark Todo Complete / Incomplete)
2. Enter the ID of the todo you want to toggle
3. The system will confirm the new status

### Exiting the Application
1. Select option 6 (Exit)
2. The application will terminate

## Important Notes

- All data is stored in memory only and will be lost when the application exits
- Todo IDs are auto-incremented and unique within the current session
- Invalid inputs will result in error messages, and the menu will reappear
- The application will not crash due to invalid user input