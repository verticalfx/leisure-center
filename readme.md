# Leisure Center Management Application

uni project assignment
## Introduction
The **Leisure Center** application is a web-based platform designed to manage and participate in various classes and facilities. Built using **Node.js**, **Express.js**, **EJS**, and **SQL**, the application offers features such as user registration, class scheduling, facility management, and real-time updates.

## Features
- **User Registration and Authentication**
- **Class Scheduling and Registration**
- **Search and Filter Functionality**
- **Admin Panel for User and Facility Management**

## Technologies
- **Frontend:** EJS, HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** Database
- **Git** (for version control)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/verticalfx/leisure-center.git
   ```
2. **Navigate to the Project Directory:**
    ```bash
    cd leisure-center
    ```
3. **Install Dependencies**
    ```bash
    npm install
    ```

### Database Setup

1. **Create Database and Tables:**
    Execute the provided database.sql script to set up the database schema

   ```bash
   mysql -u root -p < database.sql
   ```
2. **Configure Database Connection:**
    Create a .env file in the root directory and add the following:

    ```bash
    WEBSITE_NAME=
    DB_HOST=
    DB_USER=
    DB_PASSWORD=
    DB_NAME=
    JWT_SECRET=
    WORKOUT_API_KEY=
    NUTRITION_API_KEY=
    NUTRITION_APP_ID=
    PORT=
    ```

### Running the Application

1. **Start the Server:**
   ```bash
   npm start

   ```
2. **Access the Application:**
    Open your browser and navigate to http://localhost:3000