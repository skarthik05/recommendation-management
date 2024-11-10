# Recommendation Management

Welcome to the **Recommendation Management API**! This backend service helps users organize their favorite recommendations—movies, songs, places, and more—into collections that they can manage however they like. Built with **Node.js**, **Express**, and **PostgreSQL**, it’s designed to be simple, efficient, and easy to use.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Setting Up the Database](#setting-up-the-database)
3. [Running the App](#running-the-app)
4. [Loading Sample Data](#loading-sample-data)
5. [API Endpoints Overview](#api-endpoints-overview)
6. [Project Assumptions](#project-assumptions)

---

### 1. Getting Started

#### Prerequisites

Before diving in, make sure you have:
- **Node.js** and **npm** installed
- Access to a **PostgreSQL** database (you could use a free service like [Neon.tech](https://neon.tech/), or any other hosting provider)

#### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/skarthik05/recommendation-management
   cd recommendation-management
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - In the project root, create a `.env` file with your database connection details:
     ```plaintext
     DATABASE_URL=your_postgresql_database_url
     PORT=3000
     ```
   - Replace `DATABASE_URL` with your actual PostgreSQL URL. This connects the app to your database.

---

### 2. Setting Up the Database

To get the database ready, we’ll set up tables for users, recommendations, collections, and the relationships between them.

1. **Connect to PostgreSQL**:
   - You can use a terminal or SQL client (like pgAdmin) to connect to your PostgreSQL instance.

2. **Run the schema setup**:
   - Copy and paste the SQL commands below to create the necessary tables.

   ```sql
   CREATE TABLE users (
       id BIGSERIAL PRIMARY KEY,
       fname VARCHAR(255) NOT NULL,
       sname VARCHAR(255) NOT NULL,
       profile_picture TEXT NOT NULL,
       bio TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE recommendations (
       id BIGSERIAL PRIMARY KEY,
       user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
       title VARCHAR(255) NOT NULL,
       caption TEXT,
       category VARCHAR(50) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE collections (
       id BIGSERIAL PRIMARY KEY,
       user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       UNIQUE (user_id, name)
   );

   CREATE TABLE collection_recommendations (
       collection_id BIGINT REFERENCES collections(id) ON DELETE CASCADE,
       recommendation_id BIGINT REFERENCES recommendations(id) ON DELETE CASCADE,
       PRIMARY KEY (collection_id, recommendation_id)
   );
   ```

The constraints enforce unique collection names for each user and prevent duplicate recommendations within a collection.

---

### 3. Running the App

You’re all set! Here’s how to run the server and get the API up and running:

1. **Start the server**:
   ```bash
   npm start
   ```

2. By default, the app runs on `http://localhost:3000`. You can change the port in the `.env` file if needed.

---

### 4. Loading Sample Data

To load sample data into the `users` and `recommendations` tables, you can use the `psql` command with the `\copy` command. This will import CSV data directly into PostgreSQL.

#### Importing Data Using `psql`

1. **Place the CSV files** in an accessible directory (e.g., `/tmp/`).

2. **Run the following commands** to load data into the database:

   ```bash
   # Import data into the users table
   psql -U your_db_username -d your_db_name -h your_host_url -c "\copy table_name FROM '/path/to/your/users.csv' WITH (FORMAT csv, HEADER true);"
   
   # Import data into the recommendations table
   psql -U your_db_username -d your_db_name -h your_host_url -c "\copy recommendations FROM '/path/to/your/recommendations.csv' WITH (FORMAT csv, HEADER true);"
   ```

   - Replace `your_db_username`, `your_db_name`, and `your_host_url` with your actual database credentials and host information.
   - Update the file paths to match the location of your CSV files.
   - **Note**: Make sure `user_id` values in `recommendations.csv` align with `id` values in `users.csv` to maintain data integrity.

---

### 5. API Endpoints

#### 1. Create a Collection
- **POST** `/api/collections`
- **Payload**:
  ```json
  {
    "userId": 1,
    "name": "Favorite Movies",
    "description": "A collection of my all-time favorite movies."
  }
  ```
- **Description**: Creates a new collection for a user. Each user can have multiple collections, but the `name` of each collection must be unique for the user.

#### 2. Add a Recommendation to a Collection
- **POST** `/api/collections/:id/recommendations`
- **Payload**:
  ```json
  {
    "recommendationId": 10
  }
  ```
- **Description**: Adds a recommendation to the specified collection. Each recommendation can be added to multiple collections, but only once per collection.

#### 3. Remove a Recommendation from a Collection
- **DELETE** `/api/collections/:id/recommendations/:recommendationId`
- **Description**: Removes a recommendation from a collection. No payload is needed for this request.

#### 4. View Recommendations in a Collection
- **GET** `/api/collections/:id/recommendations?page=1&limit=10`
- **Description**: Retrieves all recommendations in the specified collection. Supports pagination with `page` and `limit` query parameters.

#### Request Headers:
- `user_id`: The ID of the user whose collections are to be fetched.

Example Request:
```http
GET /api/collections/:id/recommendations?page=1&limit=10
user_id: <user_id>
```

#### Example Response:
```json
{
    "page": 1,
    "limit": 1,
    "totalPages": 1,
    "totalRecommendations": 1,
    "recommendations": [
        {
            "id": 2,
            "user_id": 1,
            "title": "Breaking Bad",
            "caption": "Gripping and intense.",
            "category": "tvshow",
            "created_at": "2023-05-02T08:45:15.000Z"
        }
    ]
}
```

#### 5. Delete a Collection
- **DELETE** `/api/collections/:id`
- **Description**: Deletes the specified collection and removes all associated recommendations from it. No payload is needed for this request.

#### 6. Get User Collections
- **GET** `/api/collections`
- **Description**: Retrieves all collections belonging to a specific user. The `user_id` must be provided in the request headers for authentication.

#### Request Headers:
- `user_id`: The ID of the user whose collections are to be fetched.

Example Request:
```http
GET /api/collections
user_id: <user_id>
```

#### Example Response:
```json
[
    {
        "id": 18,
        "user_id": 1,
        "name": "Action",
        "description": null,
        "created_at": "2024-11-09T11:14:48.610Z"
    },
    {
        "id": 17,
        "user_id": 1,
        "name": "Comedy",
        "description": null,
        "created_at": "2024-11-09T10:57:25.150Z"
    }
]
```

#### Notes:
- **user_id** is pulled from the `user_id` header, which allows the system to retrieve collections specific to that user.
- The collections returned will only be those belonging to the user specified in the request header.

---

### 6. Project Assumptions

This project includes a few important assumptions and design choices that help keep things simple and ensure data integrity. Here’s an overview:

1. **Unique Collection Names**:
   - Each user can create multiple collections, but each collection name must be unique to that user. This is enforced at the database level, ensuring no two collections can share the same name for the same user.

2. **No Duplicate Recommendations in a Collection**:
   - Recommendations can be added to different collections, but each recommendation can appear only once in any given collection. This is handled through a service check that ensures a recommendation isn't added twice.

3. **Adding Recommendations to a Collection**:
   - **Existing APIs**: I assume there are existing endpoints for listing collections and recommendations, allowing users to select and add recommendations to a collection.
   - **Ownership Validation**: When adding a recommendation, the service checks that:
     - The collection belongs to the user.
     - The recommendation also belongs to the user.
   - **Error Handling**: If a user tries to add a recommendation that's already in the collection or one they don't own, the API returns a clear error message.

4. **Removing Recommendations from a Collection**:
   - I assume there’s a separate API to list the recommendations already added to a collection, making it easy for users to see what they’ve added.
   - No extra validation is needed for removing recommendations, as users can only remove recommendations they've already added.

5. **Deleting a Collection**:
   - Deleting a collection removes the connection between the collection and its recommendations. However, the recommendations themselves remain in the recommendations table, preserving the user's list of recommendations.

6. **Data Integrity and Foreign Key Constraints**:
   - Foreign key constraints are used to ensure data integrity. For example, when adding a recommendation to a collection, the user_id for the recommendation must match the user_id for the collection, ensuring users only manage their own recommendations and collections.

7. **User Authentication**:
   - In a real production environment, user authentication would be handled via a session or token, which would securely pass the user_id.
   - For simplicity, in this project, user_id is pulled from the request headers to simulate authenticated access without a complete authentication flow.




