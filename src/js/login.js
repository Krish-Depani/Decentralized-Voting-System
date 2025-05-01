const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get voter_id and password from the form inputs
  const voter_id = document.getElementById('voter-id').value;
  const password = document.getElementById('password').value;

  // Prepare the data to send in the request body
  const data = {
    voter_id: voter_id,
    password: password
  };

  // Send the POST request with the voter_id and password in the body
  fetch('http://127.0.0.1:8000/login', {
    method: 'POST', // Change to POST
    headers: {
      'Content-Type': 'application/json', // Set the content type as JSON
    },
    body: JSON.stringify(data) // Send the data as JSON in the request body
  })
  .then(response => {
    if (response.ok) {
      return response.json(); // Parse the response body if login is successful
    } else {
      throw new Error('Login failed');
    }
  })
  .then(data => {
    // Handle the role returned by the backend
    if (data.role === 'admin') {
      console.log(data.role); // You can log the role to verify it's correct
      localStorage.setItem('jwtTokenAdmin', data.token); // Store the admin token
      // Redirect to admin.html
      window.location.replace(`http://127.0.0.1:8080/admin.html?Authorization=Bearer ${localStorage.getItem('jwtTokenAdmin')}`);
    } else if (data.role === 'user') {
      localStorage.setItem('jwtTokenVoter', data.token); // Store the user token
      // Redirect to index.html
      window.location.replace(`http://127.0.0.1:8080/index.html?Authorization=Bearer ${localStorage.getItem('jwtTokenVoter')}`);
    }
  })
  .catch(error => {
    console.error('Login failed:', error.message);
  });
});
