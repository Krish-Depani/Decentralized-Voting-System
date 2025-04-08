# 🗳️ Decentralized Voting System using Ethereum Blockchain

A blockchain-powered voting DApp that ensures transparent, secure, and immutable elections. The system combines Ethereum smart contracts with a FastAPI backend and a MySQL database for user management.

## 🚀 Features

- 🔐 JWT-based authentication for secure login and role-based access.
- ⛓️ Ethereum Smart Contracts ensure trustless, tamper-proof voting.
- 📊 Admin Dashboard for managing candidates, election dates, and results.
- 🧑‍💻 User-friendly interface to vote and view candidates.

## ⚙️ Requirements

| Tool        | Version         |
|-------------|------------------|
| Node.js     | 18.14.0          |
| Python      | 3.9              |
| MetaMask    | Browser extension |
| Ganache     | Local blockchain |
| Truffle     | Global install   |
| MySQL       | Port 3306        |
| FastAPI     | Python backend   |

## 🛠️ Setup Instructions

### 🧪 1. Local Blockchain Setup (Testing)

Install Ganache:
npm install -g ganache

For production: Install Metamask for the browser and make a new wallet.

Start Ganache with deterministic accounts. this will store files in current directory to retain accounts:
ganache --port 8545 --mnemonic "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" --networkId 5777

### 🔗 2. Connect MetaMask (Browser Extension)

    Add a custom network to MetaMask:

        Network Name: Localhost 8545

        RPC URL: http://127.0.0.1:8545

        Chain ID: 1337

    Import a few test accounts from Ganache using the private keys shown in the CLI.

### 📦 3. Smart Contracts

Install Truffle:
npm install -g truffle

Compile and deploy the contracts:
truffle compile
truffle migrate --reset

### 🗄️ 4. MySQL Setup
Run MySQL server (Docker is better). Create the database and table:
CREATE DATABASE voter_db;
USE voter_db;
CREATE TABLE voters (
  voter_id VARCHAR(36) PRIMARY KEY NOT NULL,
  role ENUM('admin', 'user') NOT NULL,
  password VARCHAR(255) NOT NULL
);

Insert test data:
INSERT INTO voters (voter_id, role, password) VALUES
('0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 'admin', 'admin123'),
('0xf17f52151EbEF6C7334FAD080c5704D77216b732', 'user', 'voter123');

Make sure to use actual Ganache account addresses as voter_id.

### 🔐 5. Backend API (FastAPI)

Navigate to the backend directory:
cd Database_API

Create and activate a virtual environment:
python3 -m venv venv
source venv/bin/activate

Install Python dependencies:
pip install fastapi mysql-connector-python pydantic python-dotenv 'uvicorn[standard]' PyJWT

Update your .env file in ./Database_API/.env:
MYSQL_USER="root"
MYSQL_PASSWORD="your_password"
MYSQL_HOST="127.0.0.1"
MYSQL_DB="voter_db"
SECRET_KEY="your_super_secret_key / optional leave as is"

Start the FastAPI server:
uvicorn main:app --reload --host 127.0.0.1

### 🌐 6. Frontend Setup
From the root of the project:
npm install

Bundle frontend code using Browserify:
browserify ./src/js/app.js -o ./src/dist/app.bundle.js

Start the frontend server:

node index.js

Visit the app in your browser:
http://localhost:8080

### 👥 User Roles

    Admin: Can log in, add candidates, and set voting dates.

    User: Can log in and vote during the active voting period.

### 📌 Notes

    This project is for educational/demo use. Do not store sensitive info or real credentials.
    Always validate inputs and sanitize user data for production deployments.
    Contract addresses change with each redeployment using truffle migrate --reset.