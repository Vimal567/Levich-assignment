# Levich Assignment – Authentication & Comment Permission Service

This is a **full-stack application** built with:

- **Backend**: Node.js (Express) + MongoDB
- **Frontend**: React + Bootstrap

It handles:
✅ User authentication & session management  
✅ Role-based permissions (read, write, delete)  
✅ Comment system with permission control  
✅ React UI for interaction  

You can check out the deployed versions here:
- 🔗 **Frontend**: [https://levich-assignment.netlify.app/](https://levich-assignment.netlify.app/)
- 🔗 **Backend**: [https://levich-assignment-1.onrender.com/](https://levich-assignment-1.onrender.com/)

---

## 🚀 Features

- **Signup & Login**  
  Secure user registration & login with hashed passwords.

- **Token-based Sessions**  
  Short-lived access tokens + long-lived refresh tokens.  
  Secure refresh + logout handling.

- **Forgot Password**  
  Token-based reset (mocked without email sending).

- **Role & Permission Management**  
  Assign users permissions: `read`, `write`, `delete`(anyone).  
  Only admins can promote users to admin.

- **Comments Module**  
  Users can read, write, delete comments depending on their permissions.

- **React UI**  
  Built-in frontend for interacting with the backend API.

---

## 📂 Tech Stack

| Layer      | Technology            |
|------------|-----------------------|
| Backend    | Node.js, Express      |
| Database   | MongoDB (Mongoose)    |
| Frontend   | React, Bootstrap      |
| Auth       | JWT (Access + Refresh tokens) |
| Deployment | Render (Backend), Netlify (Frontend) |

---

| Endpoint                     | Description                             |
| ---------------------------- | --------------------------------------- |
| POST `/auth/register`        | Register a new user                     |
| POST `/auth/login`           | Login with email/password               |
| POST `/auth/forgot-password` | Request a reset token                   |
| POST `/auth/reset-password`  | Reset password using token              |
| POST `/auth/refresh-token`   | Get a new access token                  |
| POST `/auth/logout`          | Logout, invalidate session              |
| GET `/comments`              | Get comments (if read permission)       |
| POST `/comments`             | Add a comment (if write permission)     |
| DELETE `/comments/:id`       | Delete a comment (if delete permission) |
| GET `/permissions`           | Get current user permissions            |
| PUT `/permissions`           | Update user permissions (admin)         |
| PUT `/permissions/promote`   | Promote user to admin (admin)           |
| GET `/users`                 | List all users (admin)                  |

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Vimal567/Levich-assignment.git
cd backend
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
npm install
# or
yarn install
```

---

## 🧪 Running the App Locally

To start the development server:

```bash
npm start
# or
yarn start
```

---

# Postman Collection Setup

I’ve included a ready-to-use Postman collection to test the backend.

## ✅ File Location:
The Postman collection file can be found at the following location in the repository:

/postman/Auth_comment_service.postman_collection.json

## How to Import the Collection:

1. **Download the File**
   - Navigate to the `postman` folder in the repo and download `levich-assignment.postman_collection.json`.

2. **Open Postman App**
   - Launch the Postman application on your machine.

3. **Import the Collection**
   - Click on **Import** in the top left corner of the Postman window.
   - Choose **Upload Files**, then select the downloaded `.json` file.

4. **Set Base URL**
   - Update the base URL for the requests.
   - If you are running the backend on a server, use the following URL:
     ```
     https://levich-assignment-1.onrender.com/
     ```
   - If you're running it locally, use:
     ```
     http://localhost:8000/
     ```

5. **Authorize (If Needed)**
   - After logging in, copy the `accessToken` from the response.
   - Use this token in the **Bearer Token** section or **Authorization Headers** in Postman for the requests that require authentication.

#Test Login Credentials

Email - admin@gmail.com
Password - 12345678

## Enjoy Testing!
