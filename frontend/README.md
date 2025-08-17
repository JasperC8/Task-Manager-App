E-Prescription & Drug Tracker
Overview:
This project is an e-Prescription and drug tracking system designed for doctors and pharmacies.
Doctors can issue, view, update, and delete prescriptions.
Pharmacies can view and dispense prescriptions securely.
The system uses role-based access to prevent unauthorized actions.
The project also integrates a CI/CD pipeline using GitHub Actions and an AWS EC2 self-hosted runner, demonstrating automated testing, building, and deployment.

Features:
Role-based access (Doctor vs Pharmacy)
JWT authentication for secure login
MongoDB for flexible prescription storage
React frontend with role-specific dashboards
CI/CD pipeline with GitHub Actions + AWS EC2
PM2 & Nginx for production deployment

 Tech Stack:
Frontend: React, Yarn, TailwindCSS
Backend: Node.js, Express, MongoDB, JWT
Deployment: GitHub Actions, AWS EC2, PM2, Nginx

Deployment (CI/CD):
Push code to main branch.
GitHub Actions workflow (.github/workflows/ci.yml) runs automatically.
Installs dependencies
Runs tests
Builds frontend
Deploys backend & frontend with PM2
Nginx serves the React app on EC2.