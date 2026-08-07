# Git Remote Deployment & Client Excel Upload Guide

This guide explains how to host and deploy the **Plate Mill MES Dashboard** directly from your official GitHub repository (`https://github.com/abhinavbindra502/MES-Platemill.git`) on a central deployment server, allowing users on local client machines to access the dashboard and upload local Excel files.

---

## 1. System Architecture Overview

```
+-------------------------------------------------------+
|              1. Official GitHub Repository            |
|       (https://github.com/abhinavbindra502/MES-Platemill)
+-------------------------------------------------------+
                           |
                      `git push` / CI/CD
                           v
+-------------------------------------------------------+
|             2. Central Deployment Server              |
|  - Clones & Runs Application from Git                 |
|  - Next.js Dashboard Frontend  --> http://<SERVER>:3000|
|  - FastAPI Backend API         --> http://<SERVER>:8000|
|  - SQLite Database Storage (uploads & parsed data)    |
+-------------------------------------------------------+
                           ^
             Access UI & Upload Excel Files
                           |
+-------------------------------------------------------+
|             3. User Client System (Your PC)           |
|  - Local Excel Files (Plant operational reports)      |
|  - Web Browser (Edge / Chrome / Firefox)              |
+-------------------------------------------------------+
```

---

## 2. Step-by-Step Setup Guide

### Step A: Code Pushed to Remote Git Repository
Your repository is connected and up to date at:
`https://github.com/abhinavbindra502/MES-Platemill.git`

Whenever you make future code updates on your local system, simply run:
```bash
git add .
git commit -m "Update application features"
git push origin main
```

---

### Step B: Setup Central Deployment Server

On your central deployment server (Linux or Windows Server):

1. **Install Git and Docker**:
   - Ensure Git & Docker Compose are installed on the server.

2. **Clone your repository**:
   ```bash
   git clone https://github.com/abhinavbindra502/MES-Platemill.git /opt/plate-mill-dashboard
   cd /opt/plate-mill-dashboard
   ```

3. **Deploy using Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

---

### Step C: Single-Command Deployment Updates

Whenever code updates are pushed to GitHub, run on the deployment server:

- **Linux Server**:
  ```bash
  ./deploy.sh
  ```
- **Windows Server**:
  ```powershell
  .\deploy.ps1
  ```

---

## 3. How Users Work with Excel Files from Client Systems

1. Open your web browser on your computer:
   ```
   http://<SERVER_IP_OR_DOMAIN>:3000
   ```
2. Navigate to the **Excel Upload** / **Data Processing** page on the dashboard.
3. Drag & drop or select your local Excel file (`.xlsx` / `.xls`) from your PC.
4. Click **Upload & Process**.
5. The Excel file is sent over API to the FastAPI backend server, parsed into the database, and live KPIs/charts update automatically!
