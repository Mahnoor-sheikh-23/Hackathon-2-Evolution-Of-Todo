# Data Model: Todo CLI Application - Phase I

## Todo Entity

### Attributes
- **id**: Integer
  - Type: int
  - Description: Auto-incremented unique identifier
  - Constraints: Positive integer, unique within session
  - Default: Auto-generated based on previous ID + 1

- **title**: String
  - Type: str
  - Description: Short name of the task
  - Constraints: Non-empty string
  - Default: ""

- **description**: String
  - Type: str
  - Description: Detailed explanation of the task
  - Constraints: Can be empty string
  - Default: ""

- **completed**: Boolean
  - Type: bool
  - Description: Indicates whether the task is completed
  - Constraints: True or False
  - Default: False

### State Transitions
- A todo can transition from `completed=False` to `completed=True` (mark complete)
- A todo can transition from `completed=True` to `completed=False` (mark incomplete)

### Relationships
- No relationships with other entities (standalone entity)

## TodoManager

### Responsibilities
- Maintain collection of Todo objects in memory
- Provide CRUD operations for Todo entities
- Ensure ID uniqueness during runtime
- Handle business logic for todo operations

### Operations
- **add_todo(title: str, description: str)**: Create and store a new Todo
- **get_all_todos()**: Retrieve all stored todos
- **get_todo_by_id(todo_id: int)**: Retrieve a specific todo by ID
- **update_todo(todo_id: int, title: str, description: str)**: Update existing todo
- **delete_todo(todo_id: int)**: Remove a todo by ID
- **toggle_todo_status(todo_id: int)**: Toggle the completed status of a todo