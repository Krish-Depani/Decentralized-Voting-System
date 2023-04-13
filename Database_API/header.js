const token = '1234abcd-5678-efgh-ijkl-9012mnop3456';
const headers = {
  'Authorization': `Bearer ${token}`
};

fetch('http://192.168.250.94:8000/get-role?voter_id=3e397c8e-d60d-11ed-b72b-d0bf9c22b52a&voter_password=virat@18', { headers })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
