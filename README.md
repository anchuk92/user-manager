# User Manager App

A simple full-stack application to manage users using Firebase as the backend and Angular as the frontend. It supports full CRUD operations with RESTful API principles and provides basic search functionality by name or role.

---

## Features

- Firebase backend with:
    - Cloud Functions (written in TypeScript)
    - Firestore database
    - RESTful API for User entity
- Angular frontend with:
    - Single-page application built with **Angular**
    - UI components styled with **Angular Material**
    - State management using **NgRx Signal Store**

## Versions

- Angular: 19
- Node: 22.12.0
- npm: 11.4.2

---

## Getting Started

### Prerequisites

- Node.js
- Firebase CLI (`npm install -g firebase-tools`)
- Angular CLI (`npm install -g @angular/cli`)
- A Firebase project (created in the [Firebase Console](https://console.firebase.google.com))

---

## Setup Instructions

### 1. Clone the Repository

````
git clone https://github.com/anchuk92/user-manager-app.git
cd user-manager-app
````

### 2. Install Dependencies
Backend (Firebase Functions)
````
cd backend
npm install
````
Frontend (Angular)
````
cd ../frontend
npm install
````

### Running Locally
Backend (Emulate Firebase Functions and Firestore)
````
cd backend
firebase emulators:start
````
Make sure firebase.json has "emulators" configured for Firestore and Functions.

Frontend (Angular Dev Server)
````
cd frontend
ng serve
````
Make sure your frontend environment config (environment.ts) points to the local function URL, e.g.:
````
export const environment = {
production: false,
apiUrl: 'http://localhost:5001/PROJECT_ID/us-central1'
};
````
## API Endpoints

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | /users              | Get all users          |
| GET    | /users/:id          | Get user by ID         |
| POST   | /users              | Create new user        |
| PUT    | /users/:id          | Update user            |
| DELETE | /users/:id          | Delete user            |
| GET    | /users?search=value | Search by name or role |
| PATCH  | /users/:id          | Enable/Disable user    |

## Deploying to Firebase
#### 1. Authenticate and Set Project
````
firebase login
firebase use --add
````
#### 2. Deploy Functions
````
cd backend
firebase deploy --only functions
````

#### 3. Deploy Angular App (Optional)

To host the Angular app with Firebase Hosting:

Build the app:
````
cd frontend
ng build
````
Add hosting section to firebase.json.

````
"hosting": {
"public": "../frontend/dist/my-app/browser",
"ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
}
````
Then deploy:
````
firebase deploy --only hosting
````

## Future Improvements

Create tests for both backend and frontend

Pagination and sorting

Full-text search

Store roles in database

Split backend single file function (Controller, Service, Model)

Improve backend data validation and error handling

Consistent response format with success/error structure

Authentication via Firebase Auth

Implement global error handler on frontend
