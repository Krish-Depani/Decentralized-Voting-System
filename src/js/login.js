require('dotenv').config();
console.log(process.env);
const loginForm = document.getElementById('loginForm');
const token = 'process.env';
const headers = {
  'Authorization': `Bearer ${token}`,
};

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;

  fetch(`http://127.0.0.1:8000/get-role?voter_id=${voter_id}&password=${password}`, { headers })
  .then(response => response.json())
  .then(data => {
    if (data.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
  })
  .catch(error => {
    console.error('Login failed:', error.message);
  });
});

/*
├── blockchain-voting-dapp
    ├── build
        └── contracts
            ├── Migrations.json
            └── Voting.json
    ├── contracts
        ├── 2_deploy_contracts.js
        ├── Migrations.sol
        └── Voting.sol
    ├── migrations
        └── 1_initial_migration.js
    ├── node_modules
    ├── src
        ├── html
            ├── admin.html
            ├── login.html
            └── index.html
        └── js
            ├── .env
            ├── login.js
            └── app.js
    ├── package.json
    ├── package-lock.json
    ├── truffle.js
    └── index.js
*/