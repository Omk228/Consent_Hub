# Consent_Hub

# ConsentHub: Data Consent Management Platform

ConsentHub is a full-stack application designed to provide robust data consent management, allowing data owners to control access to their personal records and consumers to request and manage access transparently. The platform features a secure authentication system, role-based access control, and a comprehensive audit trail for all data access activities.

## Screenshots

### Login Page
![Login Page](login.png)


### Register Page
![Register Page](register.png)

### Owner Dashboard
![Owner Dashboard](owner_dashboard.png)

### My Records Page (Owner)
![My Records Page (Owner)](my_records.png)

### Access History Page (Owner)
![Access History Page (Owner)](access_history.png)

### Audit Logs Page (Owner)
![Audit Logs Page (Owner)](audit_logs.png)

### Consumer Dashboard
![Consumer Dashboard](consumer_dashboard.png)

### Search Owner Page (Consumer)
![Search Owner Page (Consumer)](search_owner.png)

### My Requests Page (Consumer)
![My Requests Page (Consumer)](my_requests.png)


## Table of Contents
1.  [Architecture Overview](#architecture-overview)
2.  [Tech Stack Reasoning](#tech-stack-reasoning)
3.  [API List](#api-list)
4.  [DB Schema Explanation](#db-schema-explanation)
5.  [Security Considerations](#security-considerations)
6.  [Setup and Installation](#setup-and-installation)
7.  [Usage](#usage)
8.  [Contributing](#contributing)
9.  [License](#license)

---

## 1. Architecture Overview

ConsentHub follows a client-server architecture with a clear separation of concerns:

*   **Frontend (Client):** Built with React, it provides the user interface for both data owners and consumers. It communicates with the backend API to fetch, send, and manage data.
*   **Backend (Server):** Developed using Node.js with the Express.js framework, it handles business logic, authentication, authorization, and interacts with the MySQL database.
*   **Database:** MySQL stores user information, data records, consent requests, and audit logs.

The interaction flows through RESTful API endpoints, secured by JWT for authentication and middleware for role-based authorization.

## 2. Tech Stack Reasoning

### Frontend

*   **React:** A declarative and component-based JavaScript library for building user interfaces. Chosen for its efficiency in handling dynamic UIs and strong community support.
*   **Vite:** A fast build tool and development server for modern web projects. Provides quick hot module replacement and optimized builds.
*   **Tailwind CSS:** A utility-first CSS framework that enables rapid UI development by composing pre-defined classes directly in JSX. Chosen for its flexibility, maintainability, and responsiveness features.
*   **React Router:** For declarative routing within the React application, enabling single-page application navigation.
*   **Axios:** A promise-based HTTP client for making API requests from the browser to the backend.
*   **Lucide React:** A set of beautiful and customizable SVG icons, providing a clean and modern visual language.

### Backend

*   **Node.js:** A JavaScript runtime for building scalable server-side applications.
*   **Express.js:** A minimal and flexible Node.js web application framework, providing a robust set of features for web and mobile applications.
*   **MySQL (via `mysql2/promise`):** A popular open-source relational database management system. `mysql2/promise` is used for asynchronous database interactions, improving performance and readability.
*   **Dotenv:** Loads environment variables from a `.env` file, keeping sensitive configuration separate from the codebase.
*   **Bcrypt.js:** A library for hashing passwords, crucial for securely storing user credentials.
*   **Jsonwebtoken (JWT):** Used for implementing token-based authentication, providing a stateless and scalable way to secure API endpoints.
*   **CORS (Cross-Origin Resource Sharing):** A Node.js middleware for enabling CORS, allowing the frontend to make requests to the backend from a different origin.

## 3. API List

All backend routes are prefixed with `/api`.

### Authentication (`/api/auth`)
*   `POST /register`: Registers a new user (Data Owner or Data Consumer).
*   `POST /login`: Authenticates a user and returns a JWT token.

### Owner Operations (`/api/owner`)
*   `POST /records`: Adds a new data record for the authenticated owner.
*   `GET /my-records`: Fetches all data records belonging to the authenticated owner.
*   `PUT /records/:id`: Updates an existing data record by its ID.
*   `DELETE /records/:id`: Deletes a data record by its ID.
*   `GET /pending`: Fetches pending consent requests for the authenticated owner.
*   `GET /all-requests`: Fetches all consent requests (pending, approved, rejected, revoked) for the authenticated owner.
*   `PUT /update-status`: Updates the status of a consent request (e.g., to 'APPROVED' or 'REJECTED').
*   `GET /audit-logs`: Fetches audit logs related to the authenticated owner's activities.

### Consumer Operations (`/api/consumer`)
*   `GET /search`: Searches for data owners by email.
*   `GET /owner-records/:ownerId`: Fetches public records available from a specific owner.
*   `GET /available-owners`: Fetches a list of all available data owners.
*   `GET /my-requests`: Fetches all consent requests made by the authenticated consumer.
*   `POST /request-access`: Sends a new data access request to a data owner for a specific record.
*   `GET /record/:recordId`: Fetches the content of a specific record for which the consumer has approved access.

### Consents Operations (`/api/consents`)
*   `POST /request`: Consumer sends a consent request to an owner. (Note: This overlaps with `/api/consumer/request-access`, implying a possible refactor).
*   `GET /owner-requests`: Fetches pending requests for an owner. (Note: This overlaps with `/api/owner/pending`).
*   `PUT /update-status`: Owner updates the status of a consent request. (Note: This overlaps with `/api/owner/update-status`).

## 4. DB Schema Explanation

The database consists of four primary tables: `users`, `records`, `consents`, and `audit_logs`.

### `users` Table
*   **Purpose:** Stores user authentication and profile information.
*   **Fields:**
    *   `id`: Primary Key, AUTO_INCREMENT.
    *   `name`: User's full name.
    *   `email`: User's email address (UNIQUE).
    *   `password`: Hashed password (for security).
    *   `role`: User's role (e.g., 'OWNER', 'CONSUMER').
    *   `created_at`: Timestamp of user registration.

### `records` Table
*   **Purpose:** Stores data records owned by data owners.
*   **Fields:**
    *   `id`: Primary Key, AUTO_INCREMENT.
    *   `owner_id`: Foreign Key referencing `users.id` (links record to its owner).
    *   `record_name`: Name/title of the data record.
    *   `category`: Category of the data (e.g., 'Healthcare', 'Finance').
    *   `content`: The actual data content, stored as a JSON string.
    *   `created_at`: Timestamp when the record was created.
    *   `updated_at`: Timestamp when the record was last updated.

### `consents` Table
*   **Purpose:** Manages data access requests and their statuses.
*   **Fields:**
    *   `id`: Primary Key, AUTO_INCREMENT.
    *   `consumer_id`: Foreign Key referencing `users.id` (the user requesting access).
    *   `owner_id`: Foreign Key referencing `users.id` (the owner of the data).
    *   `record_id`: Foreign Key referencing `records.id` (the specific record being requested).
    *   `status`: Current status of the request ('PENDING', 'APPROVED', 'REJECTED', 'REVOKED').
    *   `purpose`: The stated purpose of the data access request.
    *   `created_at`: Timestamp when the request was made.
    *   `updated_at`: Timestamp when the request status was last updated.
    *   `expires_at`: (Implicitly used for approved consents, might need a column or logic in audit logs for actual expiry).

### `audit_logs` Table
*   **Purpose:** Provides an immutable audit trail of significant events, especially consent-related actions.
*   **Fields:**
    *   `id`: Primary Key, AUTO_INCREMENT.
    *   `user_id`: Foreign Key referencing `users.id` (the user who performed the action).
    *   `action`: Type of action performed (e.g., 'CONSENT_APPROVED', 'CONSENT_REJECTED', 'CONSENT_REVOKED').
    *   `details`: A detailed description of the event.
    *   `timestamp`: Timestamp when the event occurred.
    *   `ipAddress`: (Implicitly captured, could be a column in the future).

## 5. Security Considerations

*   **Authentication (JWT):** JSON Web Tokens are used to secure API endpoints. Upon successful login, a token is issued to the client, which must be sent with subsequent requests for authentication.
*   **Password Hashing (Bcrypt.js):** User passwords are never stored in plain text. `bcrypt.js` is used to hash passwords before storing them in the database, protecting against data breaches.
*   **Authorization (`authMiddleware`):** A custom Express middleware (`authMiddleware.js`) verifies the JWT token and attaches user information (including ID and role) to the request object. This ensures that only authenticated users can access protected routes.
*   **Role-Based Access Control:** Backend controllers enforce logic to ensure that users can only perform actions relevant to their role (e.g., an owner can only manage their own records and approve/reject requests for their data).
*   **Data Isolation:** When fetching and modifying records or consents, queries explicitly filter by `owner_id` or `consumer_id` to prevent unauthorized access or modification of data belonging to other users.
*   **Input Validation:** Basic input validation is performed on incoming request bodies to prevent common vulnerabilities like SQL injection (though `mysql2/promise` with parameterized queries already helps mitigate this) and malformed data.
*   **Environment Variables:** Sensitive information like `JWT_SECRET` and database credentials are stored in environment variables (`.env` file) and not hardcoded in the codebase.

## 6. Setup and Installation

**Prerequisites:**

*   Node.js (LTS version recommended)
*   MySQL Server
*   Git

**Steps:**

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd Consent_Hub
    ```
2.  **Backend Setup:**
    ```bash
    cd Backend
    npm install
    ```
    Create a `.env` file in the `Backend` directory with your database credentials and JWT secret:
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_DATABASE=consent_hub
    PORT=5000
    JWT_SECRET=supersecretjwtkey
    ```
    Run database migrations/schema creation (you'll need to manually create the `consent_hub` database and the tables as per the schema in section 4).
    ```bash
    npm start # Or node index.js
    ```
3.  **Frontend Setup:**
    ```bash
    cd ../Frontend
    npm install
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173`.

## 7. Usage

*   **Register:** Create a new account as either a "Data Owner" or "Data Consumer".
*   **Login:** Log in with your registered credentials.
*   **Data Owner:**
    *   Add and manage your data records (`/owner/record`).
    *   View pending access requests from consumers and approve/reject them (`/owner/dashboard` or `/owner/access-history`).
    *   Monitor audit logs of all activities (`/owner/audit-logs`).
*   **Data Consumer:**
    *   Search for data owners by email (`/consumer/search`).
    *   Request access to specific data records from owners.
    *   Track the status of your access requests (`/consumer/requests`).
    *   View data for which you have approved access (`/consumer/view-record/:recordId`).

## 8. Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 9. License

This project is licensed under the MIT License. See the `LICENSE` file for details.
