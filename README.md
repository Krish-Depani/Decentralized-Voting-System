# Decentralized-Voting-System-Using-Ethereum-Blockchain

#### The Decentralized Voting System using Ethereum Blockchain is a secure and transparent solution for conducting elections. Leveraging Ethereum's blockchain technology, this system ensures tamper-proof voting records, enabling users to cast their votes remotely while maintaining anonymity and preventing fraud. Explore this innovative project for trustworthy and decentralized voting processes.
#### For a cool demo of this project watch this [YouTube video](https://www.youtube.com/watch?v=a5CJ70D2P-E).
#### For more details checkout [Project Report](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/Project%20Report%20github.pdf).

## Features
-  Implements JWT for secure voter authentication and authorization.
-  Utilizes Ethereum blockchain for tamper-proof and transparent voting records.
-  Removes the need for intermediaries, ensuring a trustless voting process.
-  Admin panel to manage candidates, set voting dates, and monitor results.
-  Intuitive UI for voters to cast votes and view candidate information.

## Requirements
- Node.js (version – 18.14.0)
- Metamask
- Python (version – 3.9)
- FastAPI
- MySQL Database (port – 3306)

## Screenshots

![Login Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/login%20ss.png)

![Admin Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/admin%20ss.png)

![Voter Page](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/public/index%20ss.png)

## Installation

1. Open a terminal.

2. Clone the repository by using the command
        
        git clone https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain.git

3. Download and install [Ganache](https://trufflesuite.com/ganache/).

4. Create a workspace named <b>developement</b>, in the truffle projects section add `truffle-config.js` by clicking `ADD PROJECT` button.

5. Download [Metamask](https://metamask.io/download/) extension for the browser.

6. Now create wallet (if you don't have one), then import accounts from ganache.

7. Add network to the metamask. ( Network name - Localhost 7575, RPC URl - http://localhost:7545, Chain ID - 1337, Currency symbol - ETH)

8. Open MySQL and create database named <b>voter_db</b>. (DON'T USE XAMPP)

9. In the database created, create new table named <b>voters</b> in the given format and add some values.

           CREATE TABLE voters (
           voter_id VARCHAR(36) PRIMARY KEY NOT NULL,
           role ENUM('admin', 'user') NOT NULL,
           password VARCHAR(255) NOT NULL
           );
   <br>

        +--------------------------------------+-------+-----------+
        | voter_id                             | role  | password  |
        +--------------------------------------+-------+-----------+
        |                                      |       |           |
        +--------------------------------------+-------+-----------+

12. Install truffle globally
    
        npm install -g truffle

14. Go to the root directory of repo and install node modules

        npm install

15. Install python dependencies

        pip install fastapi mysql-connector-python pydantic python-dotenv uvicorn uvicorn[standard] PyJWT

## Usage

#### Note: Update the database credentials in the `./Database_API/.env` file.

1. Open terminal at the project directory

2. Open Ganache and it's <b>development</b> workspace.

3. open terminal in project's root directory and run the command

        truffle console
   then compile the smart contracts with command

        compile
   exit the truffle console

5. Bundle app.js with browserify
    
        browserify ./src/js/app.js -o ./src/dist/app.bundle.js

2. Start the node server server
    
        node index.js

3. Navigate to `Database_API` folder in another terminal
    
        cd Database_API
    then start the database server by following command

        uvicorn main:app --reload --host 127.0.0.1

4. In a new terminal migrate the truffle contract to local blockchain
    
        truffle migrate

You're all set! The Voting app should be up and running now at http://localhost:8080/.<br>
For more info about usage checkout [YouTube video](https://www.youtube.com/watch?v=a5CJ70D2P-E).

## Code Structure

    ├── blockchain-voting-dapp            # Root directory of the project.
        ├── build                         # Directory containing compiled contract artifacts.
        |   └── contracts                 
        |       ├── Migrations.json       
        |       └── Voting.json           
        ├── contracts                     # Directory containing smart contract source code.
        |   ├── 2_deploy_contracts.js     
        |   ├── Migrations.sol            
        |   └── Voting.sol                
        ├── Database_API                  # API code for database communication.
        |   └── main.py                   
        ├── migrations                    # Ethereum contract deployment scripts.
        |   └── 1_initial_migration.js    
        ├── node_modules                  # Node.js modules and dependencies.
        ├── public                        # Public assets like favicon.
        |   └── favicon.ico               
        ├── src                           
        |   ├── assets                    # Project images.
        |   |   └── eth5.jpg              
        |   ├── css                       # CSS stylesheets.
        |   |   ├── admin.css             
        |   |   ├── index.css             
        |   |   └── login.css             
        |   ├── dist                      # Compiled JavaScript bundles.
        |   |   ├── app.bundle.js         
        |   |   └── login.bundle.js       
        |   ├── html                      # HTML templates.
        |   |   ├── admin.html            
        |   |   ├── index.html            
        |   |   └── login.html            
        |   └── js                        # JavaScript logic files.
        |       ├── app.js                
        |       └── login.js              
        ├── index.js                      # Main entry point for Node.js application.
        ├── package.json                  # Node.js package configuration.
        ├── package-lock.json             # Lockfile for package dependencies.
        ├── README.md                     # Project documentation.
        └── truffle-config.js                    # Truffle configuration file.

## License

The code in this repository is licensed under the MIT License. This means that you are free to use, modify, and distribute the code, as long as you include the original copyright and license notice. For more information about LICENSE please click [here](https://github.com/Krish-Depani/Decentralized-Voting-System-Using-Ethereum-Blockchain/blob/main/LICENSE).

## If you like this project, please give it a 🌟.
## Thank you 😊.
