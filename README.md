# PetHub 🐾

A full-stack pet adoption and e-commerce application built with Next.js 16, Prisma, PostgreSQL, and React 19. This platform connects pets with potential adopters and provides a shop for pet supplies.

## 🚀 Features

### User Features
- **Authentication System**: Secure JWT-based authentication with bcrypt password hashing.
- **Pet Browsing**: Browse available pets for adoption with filtering by type, breed, and more.
- **Adoption Applications**: Submit applications to adopt pets and track their status.
- **Shop**: Browse pet products and supplies.
- **Nearby Care**: Find veterinary clinics and pet care services near you using interactive maps.
- **Responsive Design**: Mobile-friendly interface with a modern UI.

### Admin Features
- **Dashboard**: Comprehensive overview of pets, applications, and users.
- **Pet Management**: Add, edit, and remove pets from the platform.
- **Application Management**: Review, approve, or reject adoption applications.
- **User Management**: Manage user accounts and roles (Superadmin only).

## 📋 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Maps**: Leaflet / OpenStreetMap

## 🗂️ Project Structure

```
pethub/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.js                # Database seeding script
├── app/
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── pets/              # Pet management endpoints
│   │   ├── applications/      # Application endpoints
│   │   ├── products/          # Shop product endpoints
│   │   ├── users/             # User management endpoints
│   │   └── care/              # Nearby care endpoints
│   ├── admin/                 # Admin dashboard
│   ├── pets/                  # Pet listing and details
│   ├── shop/                  # Product shop
│   ├── dashboard/             # User dashboard
│   ├── login/                 # Login page
│   └── signup/                # Signup page
├── components/                # React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PetCard.jsx
│   ├── ShopCard.jsx
│   └── AuthGuard.jsx
└── public/                    # Static assets
```

## 🛣️ API Routes

### Authentication
- **POST /api/auth/signup**: Create a new user account.
- **POST /api/auth/login**: Authenticate user and receive JWT token.

### Pets
- **GET /api/pets**: Get a list of pets with pagination and filtering.
- **POST /api/pets**: Create a new pet listing (Admin only).
- **GET /api/pets/[id]**: Get a single pet's details.
- **PUT /api/pets/[id]**: Update a pet listing (Admin only).
- **DELETE /api/pets/[id]**: Delete a pet listing (Admin only).

### Applications
- **GET /api/applications**: Get all applications (Admin) or user's applications.
- **POST /api/applications**: Submit a new adoption application.
- **PUT /api/applications/[id]**: Update application status (Admin only).

### Products
- **GET /api/products**: Get a list of products with pagination and sorting.

### Users
- **GET /api/users**: Get a list of users (Superadmin only).
- **DELETE /api/users/[id]**: Delete a user (Superadmin only).

## 📬 Postman / API Usage Examples

Here are the details for testing the API endpoints using Postman or cURL.

### Authentication

**Signup**
- **URL**: `http://localhost:3000/api/auth/signup`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123",
    "role": "USER"
  }
  ```

**Login**
- **URL**: `http://localhost:3000/api/auth/login`
- **Method**: `POST`
- **Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response**: Returns a `token`. Use this token in the `Authorization` header for protected routes: `Bearer <your_token>`.

### Pets

**Get All Pets**
- **URL**: `http://localhost:3000/api/pets?page=1&limit=9&sort=newest`
- **Method**: `GET`
- **Response**: Returns a list of pets with pagination metadata.

**Get Single Pet**
- **URL**: `http://localhost:3000/api/pets/[id]`
- **Method**: `GET`
- **Response**: Returns details of a specific pet.

**Create Pet (Admin Only)**
- **URL**: `http://localhost:3000/api/pets`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "name": "Buddy",
    "breed": "Golden Retriever",
    "age": "2 years",
    "size": "Large",
    "type": "Dog",
    "gender": "Male",
    "color": "Golden",
    "vaccinated": true,
    "neutered": true,
    "description": "Friendly and energetic dog.",
    "image": "https://example.com/buddy.jpg",
    "status": "AVAILABLE"
  }
  ```

**Update Pet (Admin Only)**
- **URL**: `http://localhost:3000/api/pets/[id]`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "status": "ADOPTED",
    "age": "3 years"
  }
  ```

**Delete Pet (Admin Only)**
- **URL**: `http://localhost:3000/api/pets/[id]`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "Pet deleted"}`

### Applications

**Get All Applications (Admin)**
- **URL**: `http://localhost:3000/api/applications?page=1&limit=10&sort=newest`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns a list of adoption applications.

**Submit Application**
- **URL**: `http://localhost:3000/api/applications`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "petId": 1,
    "message": "I would love to adopt Buddy because..."
  }
  ```

**Update Application Status (Admin Only)**
- **URL**: `http://localhost:3000/api/applications/[id]`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "status": "APPROVED"
  }
  ```

### Users

**Get All Users (Superadmin Only)**
- **URL**: `http://localhost:3000/api/users?page=1&limit=10`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Returns a list of users.

**Delete User (Superadmin Only)**
- **URL**: `http://localhost:3000/api/users/[id]`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "password": "superadmin_password"
  }
  ```
- **Response**: `{"message": "User deleted successfully"}`

### Products

### Products

**Get All Products**
- **URL**: `http://localhost:3000/api/products?page=1&limit=9&sort=price_asc`
- **Method**: `GET`
- **Response**: Returns a list of products with pagination.

**Get Single Product**
- **URL**: `http://localhost:3000/api/products/[id]`
- **Method**: `GET`
- **Response**: Returns details of a specific product.

**Create Product (Admin Only)**
- **URL**: `http://localhost:3000/api/products`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "name": "Premium Dog Food",
    "category": "Food",
    "price": 49.99,
    "description": "High-quality food for adult dogs.",
    "imageUrl": "https://example.com/dogfood.jpg",
    "inStock": true
  }
  ```

**Update Product (Admin Only)**
- **URL**: `http://localhost:3000/api/products/[id]`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (JSON):
  ```json
  {
    "price": 45.99,
    "inStock": false
  }
  ```

**Delete Product (Admin Only)**
- **URL**: `http://localhost:3000/api/products/[id]`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{"message": "Product deleted"}`

## 🗄️ Database Schema

### User
- **id**: Int (Primary Key)
- **name**: String
- **email**: String (Unique)
- **password**: String (Hashed)
- **role**: Enum (SUPERADMIN, ADMIN, USER)
- **createdAt**: DateTime

### Pet
- **id**: Int (Primary Key)
- **name**: String
- **breed**: String
- **age**: String
- **size**: String
- **type**: String
- **status**: Enum (AVAILABLE, ADOPTED, PENDING)
- **ownerId**: Int (Foreign Key)

### Application
- **id**: Int (Primary Key)
- **userId**: Int (Foreign Key)
- **petId**: Int (Foreign Key)
- **status**: Enum (PENDING, APPROVED, REJECTED)
- **message**: String

### Product
- **id**: Int (Primary Key)
- **name**: String
- **category**: String
- **price**: Float
- **description**: String
- **imageUrl**: String
- **inStock**: Boolean

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pethub
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file and add your database URL and JWT secret:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pethub"
   JWT_SECRET="your-secret-key"
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.js  # Optional: Seed with initial data
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage.
- **JWT Authentication**: Stateless authentication with JSON Web Tokens.
- **Role-Based Access Control**: Protected routes and API endpoints for Admins and Superadmins.
- **AuthGuard**: Client-side component to protect private routes.

## 🎨 UI/UX Features

- **Responsive Design**: Built with Tailwind CSS for all screen sizes.
- **Interactive Maps**: Integrated Leaflet maps for finding nearby care.
- **Dynamic Filtering**: Real-time filtering for pets and products.
- **Toast Notifications**: User feedback for actions like login and application submission.

## 📝 License

This project is for educational purposes.
