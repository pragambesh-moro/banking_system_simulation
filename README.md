# Banking System Simulation

A full-stack banking application designed to model core financial workflows. This project focuses on backend engineering fundamentals, specifically emphasizing data consistency, atomic transactions, and clean API design within a FinTech context.

---

## 🛠 Tech Stack

* **Backend:** Python 3.10+, FastAPI, SQLAlchemy (ORM)
* **Frontend:** ReactJS
* **Database:** MySQL
* **Environment:** Linux-based development

---

## 🚧 Project Status

**Current Status: In Progress (Phase-5: Testing)**

The core backend logic for atomic transfers and account management has been completed successfuly. Frontend integration has been completed. Deployment has been completed. Testing is in progress.

---

## 🏗 System Architecture

The system follows a monolithic client-server architecture. The React frontend consumes RESTful APIs exposed by the FastAPI backend, which handles business logic and manages state in a MySQL relational database.

```text
+---------------------+           +--------------------------+           +---------------------+
|      Frontend       |           |         Backend          |           |      Database       |
|                     |   HTTP    |                          |   SQL     |                     |
|  [ ReactJS App ]    | <-------> |    [ FastAPI App ]       | <-------> |      [ MySQL ]      |
|  - UI Components    |   JSON    |  - Pydantic Models       |           |   - User Tables     |
|  - State Management |           |  - Transaction Logic     |           |   - Ledger Tables   |
|                     |           |  - SQLAlchemy ORM        |           |   - ACID            |
+---------------------+           +--------------------------+           +---------------------+
```

---

## ✨ Features

### Backend (FastAPI)
* **Account Management:** Create new accounts with initial balances.
* **Fund Operations:** Deposit and withdraw funds with validation.
* **Inter-Account Transfers:** Move funds between accounts securely.
* **Transaction Ledger:** Immutable record of all financial movements.
* **Error Handling:** Standardized HTTP error responses for insufficient funds or invalid accounts.

### Frontend (React)
* **User Dashboard:** View current balance and recent activity.
* **Transfer Interface:** Form to initiate transfers to other account IDs.
* **Real-time Feedback:** Success/Error notifications based on API responses.

---

## ⚙️ Key Engineering Concepts

This project was built to demonstrate specific competencies required in financial software engineering:

1.  **Atomicity & ACID Transactions:**
    * Financial transfers are wrapped in database transactions. If a credit fails after a debit, the entire operation rolls back to prevent money creation or destruction.

2.  **Concurrency Control:**
    * Implements **row-level locking** (via `SELECT ... FOR UPDATE`) during balance modifications. This prevents race conditions where two concurrent requests could spend the same balance twice.

3.  **Data Consistency:**
    * Ensures that the sum of all transaction records matches the current account balance (Double-entry bookkeeping principles).

4.  **Separation of Concerns:**
    * Strict separation between Pydantic schemas (API data validation), SQLAlchemy models (Database representation), and Service logic.

---

## 🔌 Example API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/accounts` | Create a new bank account |
| `GET` | `/api/v1/accounts/{id}` | Retrieve balance and account details |
| `POST` | `/api/v1/transactions/deposit` | Add funds to a specific account |
| `POST` | `/api/v1/transactions/transfer` | Atomically move funds between two accounts |
| `GET` | `/api/v1/accounts/{id}/history` | Get paginated transaction ledger |

---

## 🎯 Why This Project?

While many full-stack tutorials focus on social media clones or e-commerce, this project addresses the specific constraints of **FinTech**. The primary goal is not to build a flashy UI, but to solve the engineering challenge of maintaining data integrity under simulated concurrent load. It avoids "happy path" programming by explicitly handling edge cases like negative balances, non-existent accounts, and database lock timeouts.

---

## 🔮 Future Improvements

* **Authentication:** Implement JWT-based auth (OAuth2) to secure endpoints.
* **Containerization:** Dockerize the application and database for easier deployment.
* **Testing:** Add `pytest` suite for unit testing transaction logic and concurrency scenarios.
* **Auditing:** Add a separate audit log service for compliance simulation.

---

## 👤 Author

Pragambesh Moro
https://tinyurl.com/43n9ex94
