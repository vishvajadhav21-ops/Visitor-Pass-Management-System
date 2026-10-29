<<<<<<< HEAD
# Visitor Pass Management System

A full-stack **MERN application** that digitizes visitor management by replacing paper registers with online appointment requests, host approvals, QR-code passes, and secure visitor check-in/check-out.

## Features

- **Role-Based Access:** Admin, Frontdesk, Employee, and Visitor roles.
- **JWT Authentication:** Secure login and protected routes.
- **Visitor Registration:** Register visitors and upload photos using Cloudinary.
- **Appointment Management:** Request, approve, reject, and cancel appointments.
- **QR Code Pass Generation:** Automatically generate QR codes and PDF visitor passes after approval.
- **Email Notifications:** Send appointment updates and visitor passes via email.
- **Walk-in Registration:** Allow frontdesk staff to register visitors and issue passes instantly.
- **Check-in / Check-out:** Scan QR codes using the device camera.
- **Identity Verification:** Display visitor photos after successful QR scans.
- **Pass Validation:** Prevent invalid, expired, revoked, and duplicate check-ins.
- **Dashboard and Reports:** View visit statistics and export reports in CSV and Excel formats.

## User Roles

| Role | Responsibilities |
|---|---|
| Admin | Manage staff, visitors, passes, and reports. |
| Frontdesk | Register walk-in visitors and manage check-in/check-out. |
| Employee | Approve or reject appointment requests. |
| Visitor | Register, request appointments, track status, and cancel requests. |

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **File Storage:** Cloudinary
- **QR Code & PDF:** qrcode, PDFKit
- **Email:** Nodemailer
- **Reports:** json2csv, ExcelJS

## How It Works

1. Visitors register and request appointments with employees.
2. Employees approve or reject appointment requests.
3. Approved appointments automatically generate QR-code passes and PDF badges.
4. Visitors receive their passes through email.
5. Frontdesk staff scan QR codes to verify visitors and record check-in/check-out.
6. Admins monitor visitor activity through the dashboard and export reports.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- MongoDB or MongoDB Atlas
- Cloudinary account
- Gmail account with an App Password

### 1. Clone the Repository

```bash
git clone https://github.com/vishvajadhav21-ops/Visitor-Pass-Management-System.git
cd Visitor-Pass-Management-System
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=4000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 3. Create the Admin Account

```bash
node scripts/createAdmin.js
```

Configure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file to use your own credentials. If these variables are not configured, the script may use its default credentials.

### 4. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

## Testing the Application

1. Log in as Admin and create Employee and Frontdesk accounts.
2. Register as a Visitor and request an appointment.
3. Log in as the Employee and approve the appointment.
4. Check the email for the generated QR code and PDF pass.
5. Log in as Frontdesk and scan the QR code to check the visitor in and out.
6. Log in as Admin to view dashboard statistics and reports.

## Future Enhancements

- Appointment rescheduling
- In-app notifications
- Visitor pass history
- Automated API testing
- Docker-based deployment

## Author

**Vishva Rajendra Jadhav**

B.Tech in Information Technology  
D. Y. Patil College of Engineering, Akurdi, Pune

- GitHub: [vishvajadhav21-ops](https://github.com/vishvajadhav21-ops)
- LinkedIn: [Vishva Jadhav](https://linkedin.com/in/vishva-jadhav-438364330)
=======
# Visitor-Pass-Management-System
>>>>>>> f4784d45183e24fd5c344ecc445782ea9a5f6f35
