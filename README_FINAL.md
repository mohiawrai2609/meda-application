# MEDA - Mortgage Exception Decision Automation

Welcome to **MEDA**, an AI-powered platform that accelerates the mortgage loan exception handling process. This MVP automates the tedious "chase loop" by contacting borrowers for missing documents, allowing loan processors to focus on decision-making.

---

## 🚀 Project Overview

MEDA solves the problem of manual exception tracking:
1.  **Ingest**: Loads loan exceptions from your LOS (Loan Origination System) via CSV.
2.  **Chase**: Automatically emails borrowers requesting missing documents.
3.  **Collect**: Provides a secure Borrower Portal for document uploads.
4.  **Review**: Gives processors a dashboard to review, approve, or reject documents.
5.  **Resolve**: Automatically updates the loan status upon approval.

---

## ✨ Key Features (Implemented)

### ✅ Sprint 1: Core Foundation
-   **CSV Import API**: Bulk upload exceptions.
-   **PostgreSQL Database**: Robust data schema for Loans, Exceptions, and Audit Logs.
-   **Processor Dashboard**: Real-time list of active exceptions with filtering.

### ✅ Sprint 2: AI & Communication
-   **Chase Loop Service**: Background job that identifies stale exceptions.
-   **Email Service**: Simulates sending personalized emails to borrowers.
-   **Audit Logging**: Every action (email sent, file uploaded) is tracked.

### ✅ Sprint 3: Borrower Portal
-   **Secure Upload UI**: Mobile-friendly Drag & Drop interface.
-   **Direct-to-API Uploads**: Files are securely transferred and stored.
-   **Real-time Status Updates**: Uploads instantly reflect in the dashboard.

### ✅ Sprint 4: Advanced Workbench
-   **Document Viewer**: Embedded PDF/Image preview for processors.
-   **Decision Engine**: "Approve" (Resolve) or "Reject" (Retry) workflows.
-   **Full Audit History**: View the entire timeline of an exception.

### ✅ Sprint 5: Polish & Admin
-   **Demo Reset**: One-click database wipe for clean demonstrations.
-   **Empty States**: Polished UI for all data states.
-   **Robust Error Handling**: informative feedback for users.

---

## 🛠️ Technology Stack

-   **Frontend**: React, TypeScript, Tailwind CSS, Lucide Icons
-   **Backend**: Node.js, Express, TypeScript
-   **Database**: PostgreSQL (via Prisma ORM)
-   **Infrastructure**: Docker, Docker Compose
-   **Tooling**: Vite, ESLint, Prettier

---

## 🏁 Getting Started

### Prerequisites
-   Node.js (v18+)
-   Docker Desktop (Running)

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/meda.git
    cd meda
    ```

2.  **Start Infrastructure (Database)**
    ```bash
    docker-compose up -d
    ```

3.  **Install Dependencies**
    ```bash
    npm install
    ```

4.  **Initialize Database**
    ```bash
    npx prisma migrate dev --name init
    ```

5.  **Run Development Servers**
    ```bash
    npm run dev
    ```
    -   API runs on `http://localhost:3000`
    -   Dashboard runs on `http://localhost:5173`
    -   Borrower Portal runs on `http://localhost:5174`

---

## 🎮 How to Demo (The "Happy Path")

1.  **Reset Environment**:
    -   Go to `http://localhost:5173/settings`.
    -   Click **"Reset Data"** to clear the database.

2.  **Import Exceptions**:
    -   Use the "Import New Loan" button (if implemented) or use Postman to `POST /api/import` with a CSV file.
    -   *Alternative*: Manually create a record in the DB using `npx prisma studio`.

3.  **Verify Chase Loop**:
    -   Check the dashboard (`http://localhost:5173`). You should see the new exception.
    -   Status should move to `CONTACTING` (simulated email sent).

4.  **Borrower Upload**:
    -   Open `http://localhost:5174`.
    -   Upload a sample PDF document.
    -   See the success message.

5.  **Processor Review**:
    -   Return to dashboard (`http://localhost:5173`).
    -   Click the exception to view details.
    -   Preview the document.
    -   Click **"Approve"**.
    -   Verify status changes to **RESOLVED**.

---

## 🔮 Future Roadmap (Production Readiness)

1.  **Authentication**: Integrate Clerk or Auth0 for secure login.
2.  **Cloud Storage**: Replace local file storage with AWS S3 or Google Cloud Storage.
3.  **Real Email**: Connect via SendGrid/AWS SES (currently logs to console).
4.  **AI Analysis**: Use LLMs to read the uploaded document and auto-suggest approval.

---

**Built with ❤️ by the MEDA Team**
