
# Decentralized Voting System Using Ethereum Blockchain

## Overview
The Decentralized Voting System is a secure and transparent solution for conducting elections at Murang'a University of Technology. Leveraging Ethereum's blockchain technology, this system ensures tamper-proof voting records, enabling users to cast their votes remotely while maintaining anonymity and preventing fraud.

### 2025 Edition
This updated version includes significant improvements to the user interface, security features, and overall functionality. The system now supports multiple simultaneous elections, improved account management, and a more intuitive admin experience.

#### For a demo of the original project, watch this [YouTube video](https://www.youtube.com/watch?v=a5CJ70D2P-E).
#### For more details, check out the [Project Report](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/Project%20Report%20github.pdf).

## Features

### Core Features
-  Implements JWT for secure voter authentication and authorization
-  Utilizes Ethereum blockchain for tamper-proof and transparent voting records
-  Removes the need for intermediaries, ensuring a trustless voting process
-  Admin panel to manage candidates, set voting dates, and monitor results
-  Intuitive UI for voters to cast votes and view candidate information

### 2025 Edition Enhancements
-  Support for multiple simultaneous elections
-  Improved MetaMask account switching
-  Day/Month/Year date format for better readability
-  Real-time vote tallying with visual indicators
-  Enhanced error handling and user feedback
-  Responsive design with Murang'a University branding
-  Comprehensive debugging information
-  Support for multi-device voting

### Simplified Storage-Based System
-  Standalone admin and voter interfaces that work without blockchain
-  Browser localStorage for persistent election data
-  Direct MetaMask connection for authentication
-  Prevention of double voting
-  Real-time vote counting and result visualization
-  No blockchain deployment required for testing and demonstrations

## Requirements
- Node.js (version 18.14.0 or higher)
- MetaMask browser extension
- Python (version 3.9 or higher)
- FastAPI
- MySQL Database (port 3306)
- Ganache for local blockchain development
- Web browser with JavaScript enabled
- Internet connection for MetaMask synchronization

## Screenshots

![Login Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/login%20ss.png)

![Admin Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/admin%20ss.png)

![Voter Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/index%20ss.png)

## Installation

### Prerequisites

1. Ensure you have Node.js, Python 3.9+, and MySQL installed on your system.

2. Install [Ganache](https://trufflesuite.com/ganache/) for local blockchain development.

3. Install the [MetaMask](https://metamask.io/download/) browser extension.

### Setup Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain.git
   cd Decentralized-Voting-System-Using-Ethereum-Blockchain
   ```

2. Set up Ganache:
   - Create a workspace named **development**
   - In the truffle projects section, add `truffle-config.js` by clicking the **ADD PROJECT** button
   - Start the Ganache blockchain

3. Configure MetaMask:
   - Create a wallet (if you don't have one)
   - Import accounts from Ganache
   - Add a new network with these settings:
     - Network name: Localhost 7545
     - RPC URL: http://localhost:7545
     - Chain ID: 1337
     - Currency symbol: ETH

4. Set up the database:
   - Open MySQL and create a database named **voter_db**
   - Create the voters table:
     ```sql
     CREATE TABLE voters (
       voter_id VARCHAR(36) PRIMARY KEY NOT NULL,
       role ENUM('admin', 'user') NOT NULL,
       password VARCHAR(255) NOT NULL
     );
     ```
   - Add sample users (at minimum, add an admin user):
     ```sql
     INSERT INTO voters (voter_id, role, password)
     VALUES ('admin1', 'admin', 'admin123');

     INSERT INTO voters (voter_id, role, password)
     VALUES ('user1', 'user', 'user123');
     ```

5. Install dependencies:
   - Install Truffle globally:
     ```bash
     npm install -g truffle
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     ```
   - Install Python dependencies:
     ```bash
     pip install fastapi mysql-connector-python pydantic python-dotenv uvicorn uvicorn[standard] PyJWT
     ```

6. Update database credentials:
   - Edit the `.env` file in the `Database_API` directory with your MySQL credentials

## Usage

### Starting the Application

1. Start Ganache and ensure the **development** workspace is active.

2. Compile and deploy the smart contracts:
   ```bash
   # Compile the contracts
   truffle compile

   # Deploy to the local blockchain
   truffle migrate --reset
   ```

3. Bundle the JavaScript files:
   ```bash
   # Bundle the voter interface
   npx browserify ./src/js/app.js -o ./src/dist/app.bundle.js

   # Bundle the admin interface
   npx browserify ./src/js/admin.js -o ./src/dist/admin.bundle.js

   # Bundle the login interface
   npx browserify ./src/js/login.js -o ./src/dist/login.bundle.js
   ```

4. Start the Node.js server (in the project root directory):
   ```bash
   node index.js
   ```

5. Start the FastAPI server (in a new terminal):
   ```bash
   cd Database_API
   uvicorn main:app --reload --host 127.0.0.1 --port 8888
   ```

### Accessing the Application

1. Open your browser and navigate to http://localhost:8080/

2. Log in with one of the following credentials:
   - Admin: username `admin1` with password `admin123`
   - Voter: username `user1` with password `user123`

3. Connect your MetaMask wallet to the application when prompted.

### Using the Admin Portal

1. Navigate to http://localhost:8080/admin.html

2. Use the admin interface to:
   - Create new elections with multiple candidates
   - Set voting periods with the DD/MM/YYYY date format
   - Monitor active elections and view results
   - Track voting statistics in real-time

### Using the Voter Interface

1. Navigate to http://localhost:8080/index.html

2. Use the voter interface to:
   - View available elections
   - Cast votes during active election periods
   - View election results after voting has ended

### Using the Simple Admin Interface

If you encounter issues with the standard admin interface, you can use the simplified version:

1. Navigate to http://localhost:8080/admin-simple.html

2. This version provides direct button functionality and simplified date inputs.

### Using the Simplified Storage-Based System

For a completely standalone version that works without blockchain integration:

1. **Admin Interface**: Navigate to http://localhost:8080/admin-simple-storage.html
   - Connect to MetaMask (for authentication only)
   - Create elections with custom names, dates, and candidates
   - View real-time election results
   - No blockchain deployment required

2. **Voter Interface**: Navigate to http://localhost:8080/voter-simple-storage.html
   - Connect to MetaMask (for authentication only)
   - Vote in active elections
   - View election results
   - System prevents double voting

This simplified version uses browser localStorage to store elections and votes, making it perfect for testing and demonstrations without setting up the full blockchain infrastructure.

## Code Structure

```
├── contracts/                      # Contains the Solidity smart contracts
│   ├── Migrations.sol              # Handles migration of smart contracts to the blockchain
│   ├── Voting.sol                  # Original voting contract
│   └── ElectionFactory.sol         # New contract supporting multiple elections
│
├── Database_API/                   # Contains the FastAPI server for database operations
│   ├── .env                        # Environment variables for database connection
│   ├── main.py                     # Main FastAPI server file
│   └── run_app.py                  # Script to run the FastAPI server
│
├── migrations/                     # Contains migration files for deploying smart contracts
│   ├── 1_initial_migration.js      # Initial migration file
│   ├── 2_deploy_contracts.js       # Deploys the Voting smart contract
│   └── 3_deploy_election_factory.js # Deploys the ElectionFactory contract
│
├── public/                         # Contains public assets
│   ├── admin ss.png                # Screenshot of the admin page
│   ├── index ss.png                # Screenshot of the voter page
│   └── login ss.png                # Screenshot of the login page
│
├── src/                            # Contains the source code for the frontend
│   ├── assets/                     # Contains image assets
│   │   └── eth5.jpg                # Background image
│   │
│   ├── css/                        # Contains CSS files
│   │   ├── admin.css               # Styles for the admin page
│   │   ├── admin-fixed.css         # Additional styles for the fixed admin page
│   │   ├── index.css               # Styles for the voter page
│   │   └── login.css               # Styles for the login page
│   │
│   ├── dist/                       # Contains bundled JavaScript files
│   │   ├── app.bundle.js           # Bundled JavaScript for the voter interface
│   │   ├── admin.bundle.js         # Bundled JavaScript for the admin interface
│   │   └── login.bundle.js         # Bundled JavaScript for the login page
│   │
│   ├── html/                       # Contains HTML files
│   │   ├── admin.html              # Admin page HTML
│   │   ├── admin-simple.html       # Simplified admin page with direct functionality
│   │   ├── admin-fixed.html        # Fixed admin page with improved UI
│   │   ├── admin-simple-storage.html # Standalone admin page using localStorage
│   │   ├── admin-direct-connect.html # Admin page with direct MetaMask connection
│   │   ├── admin-minimal.html      # Minimal admin page for testing
│   │   ├── voter-simple-storage.html # Standalone voter page using localStorage
│   │   ├── voter-simple.html       # Simplified voter page
│   │   ├── metamask-minimal.html   # Minimal MetaMask connection test
│   │   ├── metamask-basic.html     # Basic MetaMask connection test
│   │   ├── metamask-troubleshoot.html # MetaMask troubleshooting guide
│   │   ├── connect-metamask.html   # MetaMask connection test page
│   │   ├── index.html              # Voter page HTML
│   │   └── login.html              # Login page HTML
│   │
│   └── js/                         # Contains JavaScript files
│       ├── app.js                  # Main JavaScript for the voter interface
│       ├── admin.js                # JavaScript for the admin interface
│       ├── admin-helpers.js        # Helper functions for the admin interface
│       ├── login.js                # JavaScript for the login page
│       ├── simple-fixes.js         # Simple fixes for button functionality
│       ├── simple-metamask.js      # Simple MetaMask connection script
│       ├── direct-metamask.js      # Direct MetaMask connection script
│       └── metamask-connector.js   # Enhanced MetaMask connection script
│
├── .gitignore                      # Specifies files to be ignored by Git
├── index.js                        # Entry point for the Node.js server
├── package-lock.json               # Lock file for npm dependencies
├── package.json                    # Specifies npm dependencies
├── Project Report github.pdf       # Project report
├── README.md                       # Project documentation
└── truffle-config.js               # Configuration file for Truffle
```

## Advanced Features

### MetaMask Troubleshooting

If you encounter issues connecting to MetaMask, try these solutions:

1. **Check MetaMask Installation**:
   - Ensure MetaMask is properly installed in your browser
   - Make sure MetaMask is unlocked (you've entered your password)

2. **Configure Network Settings**:
   - Open MetaMask and click the network dropdown
   - Select "Add Network" or "Custom RPC"
   - Enter the following details:
     - Network Name: Localhost 7545
     - RPC URL: http://localhost:7545
     - Chain ID: 1337 (or 5777 depending on your Ganache configuration)
     - Currency Symbol: ETH

3. **Import Ganache Accounts**:
   - In Ganache, click the key icon next to an account to reveal its private key
   - In MetaMask, click your account icon → "Import Account"
   - Paste the private key and click "Import"

4. **Reset MetaMask Account**:
   - Open MetaMask → Settings → Advanced
   - Scroll down and click "Reset Account"
   - This will clear transaction history but keep your accounts

5. **Use Troubleshooting Tools**:
   - Navigate to http://localhost:8080/metamask-troubleshoot.html
   - This page provides detailed diagnostics and solutions

### Multi-Device Voting Support

The system supports voting from multiple devices simultaneously:

- Web-based architecture allows access from any device with a browser
- Blockchain ensures each voter can only vote once per election
- Real-time updates across all connected devices
- Responsive design adapts to different screen sizes

### Packaging as Windows Executable

The application can be packaged as a Windows executable (.exe or .msi) for easier distribution:

1. **Using Electron**:
   - Wrap the web application in an Electron container
   - Package with electron-builder to create a Windows installer
   - Include all dependencies (Node.js, blockchain tools)

2. **Using Windows Installer XML (WiX)**:
   - Create a traditional Windows installer (.msi)
   - Support for Group Policy deployment
   - Better for enterprise environments

3. **Using NSIS**:
   - Create a customizable installer with NSIS scripts
   - Smaller installer size
   - Extensive scripting capabilities

## License

The code in this repository is licensed under the MIT License. This means that you are free to use, modify, and distribute the code, as long as you include the original copyright and license notice. For more information about LICENSE please click [here](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/LICENSE).

## If you like this project, please give it a 🌟.
## Thank you 😊.
