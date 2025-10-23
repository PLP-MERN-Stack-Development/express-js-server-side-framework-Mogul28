# 🚀 Express.js RESTful Product API

This is a RESTful API built with Express.js implementing full CRUD operations, custom middleware, and error handling for a `products` resource.

## 🛠️ Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd express-js-server-side-framework
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file based on `.env.example` and set your variables (e.g., `API_KEY`).

4.  **Run the server:**
    ```bash
    node server.js
    # Server should start on http://localhost:3000
    ```

## 🔑 Environment Variables

See the `.env.example` file for all required variables. The server requires:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | The port the server will run on. | `3000` |
| `API_KEY` | Secret key for protected routes (POST, PUT, DELETE). | `mysecretapikey` |

## 💡 API Endpoints Documentation

The base path for all product routes is `/api/products`.

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Hello World welcome message. | None |
| **GET** | `/api/products` | Lists all products. Supports **Filtering** (`?category=`), and **Pagination** (`?page=1&limit=10`). | None |
| **GET** | `/api/products/:id` | Retrieves a single product by ID. | None |
| **POST** | `/api/products` | Creates a new product. Requires a valid JSON body. | `X-API-Key` header |
| **PUT** | `/api/products/:id` | Updates an existing product. Requires a valid JSON body. | `X-API-Key` header |
| **DELETE** | `/api/products/:id` | Deletes a product by ID. | `X-API-Key` header |

### Request/Response Example (POST)

**Request:**