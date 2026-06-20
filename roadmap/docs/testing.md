# Phase 2 Endpoint Testing Guide

Use these instructions to verify API functionality in Postman or Thunder Client.

## Authentication Setup (Pre-requisites)

Since the `/api/progress` and `/api/users` endpoints require a logged-in user, you must authenticate.

### Option A: Cookie Authentication (Recommended)
1. Launch the Next.js development server (`npm run dev`) and visit `http://localhost:3000/login`.
2. Login using browser developer tools (or click the testing bypass link).
3. If using Postman: Postman automatically shares cookies with your local Chrome instance if the **Postman Interceptor** or desktop agent is active.
4. If manually configuring headers, inspect your browser cookies for the `sb-access-token` cookie name and pass it as a cookie header in Postman:
   `Cookie: sb-access-token=your_token_value`

---

## Test Cases

### 1. Fetch All Tasks (Success)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/tasks`
* **Headers**: None required
* **Expected Response**: `200 OK`
  ```json
  {
    "tasks": [
      {
        "id": "uuid-value",
        "month": 1,
        "week": 1,
        "day": 1,
        "title": "Learn HTTP Request/Response cycle...",
        "task_order": 1,
        "created_at": "timestamp"
      },
      ...
    ]
  }
  ```

### 2. Fetch Tasks by Week (Success)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/tasks?month=1&week=1`
* **Headers**: None required
* **Expected Response**: `200 OK` with tasks grouped by day
  ```json
  {
    "tasks": [
      {
        "day": 1,
        "tasks": [
          { "id": "uuid-1", "title": "Learn HTTP Request/Response cycle...", ... }
        ]
      },
      ...
    ]
  }
  ```

### 3. Fetch Cohort Users (Success)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/users`
* **Headers**: `Cookie: sb-access-token=your_token_value` (Required)
* **Expected Response**: `200 OK`
  ```json
  {
    "users": [
      {
        "id": "user-uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "member",
        "created_at": "timestamp"
      }
    ]
  }
  ```

### 4. Toggle Task Progress (Insert/Update works)
* **Method**: `POST`
* **URL**: `http://localhost:3000/api/progress`
* **Headers**: 
  * `Content-Type: application/json`
  * `Cookie: sb-access-token=your_token_value` (Required)
* **Request Body**:
  ```json
  {
    "taskId": "uuid-of-task-from-case-1"
  }
  ```
* **Expected Response**: `200 OK`
  * *First run (Insert)*: returns progress record with `completed: true`.
  * *Second run (Update)*: returns progress record with `completed: false` (toggled).
  ```json
  {
    "success": true,
    "progress": {
      "id": "progress-uuid",
      "user_id": "user-uuid",
      "task_id": "task-uuid",
      "completed": true,
      "updated_at": "timestamp"
    }
  }
  ```

### 5. Fetch User Progress (Success)
* **Method**: `GET`
* **URL**: `http://localhost:3000/api/progress`
* **Headers**: `Cookie: sb-access-token=your_token_value` (Required)
* **Expected Response**: `200 OK` showing user task lists and percentages.
  ```json
  {
    "progress": [
      {
        "id": "progress-uuid",
        "user_id": "user-uuid",
        "task_id": "task-uuid",
        "completed": true,
        "updated_at": "timestamp"
      }
    ],
    "completion": {
      "completedTasks": 1,
      "totalTasks": 16,
      "percentage": 6
    }
  }
  ```
