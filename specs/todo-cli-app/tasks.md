---
description: "Task list for Todo CLI application implementation"
---

# Tasks: Todo CLI Application - Phase I

**Input**: Design documents from `/specs/todo-cli-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create src/ directory structure
- [x] T002 [P] Create empty src/main.py file
- [x] T003 [P] Create empty src/todo.py file
- [x] T004 [P] Create empty src/manager.py file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Implement Todo class in src/todo.py with id, title, description, completed attributes
- [x] T006 [P] Add auto-incrementing ID functionality to Todo class
- [x] T007 Implement TodoManager class in src/manager.py with todos list
- [x] T008 Add add_todo method to TodoManager
- [x] T009 Add get_all_todos method to TodoManager
- [x] T010 Add get_todo_by_id method to TodoManager

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add and View Todos (Priority: P1) 🎯 MVP

**Goal**: Enable users to create and view their todo tasks in a simple console application

**Independent Test**: Can be fully tested by adding a few todos and viewing them, delivering the basic value of a todo list system.

### Implementation for User Story 1

- [x] T011 [P] [US1] Add update_todo method to TodoManager in src/manager.py
- [x] T012 [P] [US1] Add delete_todo method to TodoManager in src/manager.py
- [x] T013 [P] [US1] Add toggle_todo_status method to TodoManager in src/manager.py
- [x] T014 [US1] Implement basic menu system in src/main.py with options 1-6
- [x] T015 [US1] Implement Add Todo functionality in src/main.py
- [x] T016 [US1] Implement View Todos functionality in src/main.py
- [x] T017 [US1] Connect menu options to TodoManager methods

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Update and Delete Todos (Priority: P2)

**Goal**: Allow users to modify or remove existing todo tasks to keep their list up-to-date

**Independent Test**: Can be tested by adding todos, updating their details, and deleting some, delivering the ability to maintain the todo list.

### Implementation for User Story 2

- [x] T018 [US2] Enhance Update Todo functionality in src/main.py
- [x] T019 [US2] Enhance Delete Todo functionality in src/main.py
- [x] T020 [US2] Add input validation for update operations
- [x] T021 [US2] Add confirmation prompts for delete operations

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Todos Complete/Incomplete (Priority: P3)

**Goal**: Provide the ability to track progress and mark tasks as done

**Independent Test**: Can be tested by adding todos, marking them complete/incomplete, and verifying the status changes, delivering the ability to track task completion.

### Implementation for User Story 3

- [x] T022 [US3] Implement Mark Todo Complete/Incomplete functionality in src/main.py
- [x] T023 [US3] Add toggle status logic to menu option 5
- [x] T024 [US3] Ensure status changes are properly displayed in view

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---

## Phase 6: User Story 4 - Menu Navigation and Error Handling (Priority: P4)

**Goal**: Ensure the application is user-friendly and robust against invalid inputs

**Independent Test**: Can be tested by entering various invalid inputs and confirming the application handles them gracefully while allowing proper navigation.

### Implementation for User Story 4

- [x] T025 [US4] Add error handling for invalid menu choices in src/main.py
- [x] T026 [US4] Add error handling for invalid todo IDs in src/main.py
- [x] T027 [US4] Add error handling for empty todo list operations in src/main.py
- [x] T028 [US4] Add user-friendly error messages throughout the application
- [x] T029 [US4] Add input validation for numeric inputs
- [x] T030 [US4] Ensure application doesn't crash on invalid input

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T031 [P] Add proper exit functionality to application in src/main.py
- [x] T032 [P] Add application loop to return to menu after each operation
- [x] T033 [P] Improve user interface formatting and readability
- [x] T034 [P] Add welcome message and clear menu display
- [x] T035 [P] Ensure all error messages are clear and helpful
- [x] T036 [P] Final testing of all functionality
- [x] T037 [P] Code cleanup and documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Integrates with all previous stories

### Within Each User Story

- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel by different developers
- Different user stories can be worked on in parallel by different team members

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify functionality after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence