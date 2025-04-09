# Task Manager API

A RESTful API for managing tasks, built with Node.js, Express, and MongoDB. Supports user authentication, task CRUD operations, file uploads, and email notifications.

## Features

- ✅ **User Authentication** (JWT)  
- 📝 **Task Management** (Create, Read, Update, Delete)  
- 📁 **File Uploads** (Profile pictures, task attachments)  
- ✉️ **Email Notifications** (SendGrid/Brevo integration)  
- 🔒 **Security** (Password hashing, rate limiting, sanitization)  

## Technologies Used

- **Backend**: Node.js, Express  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JSON Web Tokens (JWT)  
- **File Processing**: Multer, Sharp  
- **Email**: Brevo (formerly Sendinblue)  
- **Validation**: Validator.js  

---

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)  
- MongoDB (local or Atlas URI)  
- Brevo API key (for email)  

### 2. Installation
```bash
git clone https://github.com/your-username/task-manager-api.git
cd task-manager-api
npm install
