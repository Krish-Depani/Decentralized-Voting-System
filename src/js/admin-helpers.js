// Global counter for candidates
let candidateCounter = 1;

// Function to add a new candidate row
function addCandidate() {
  candidateCounter++;
  const newCandidateRow = `
    <div class="candidate-entry" id="candidate-${candidateCounter}">
      <table class="table text-center">
        <tr>
          <th>Name</th>
          <td><input type="text" name="name-${candidateCounter}" id="name-${candidateCounter}" placeholder="Candidate's name" required></td>
          <th>Party/Position</th>
          <td>
            <div style="display: flex; align-items: center;">
              <input type="text" name="party-${candidateCounter}" id="party-${candidateCounter}" placeholder="Party or Position" required>
              <button type="button" class="remove-candidate" data-id="${candidateCounter}" style="margin-left: 10px;" onclick="removeCandidate(${candidateCounter})">✕</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `;
  document.getElementById('additionalCandidates').innerHTML += newCandidateRow;
}

// Function to remove a candidate row
function removeCandidate(id) {
  const element = document.getElementById(`candidate-${id}`);
  if (element) {
    element.remove();
  }
}

// Format date to DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Format date and time to DD/MM/YYYY HH:MM
function formatDateTime(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Update all date displays to DD/MM/YYYY format
function updateDateDisplays() {
  const dateElements = document.querySelectorAll('.date-display');
  dateElements.forEach(element => {
    const timestamp = parseInt(element.getAttribute('data-timestamp'));
    if (!isNaN(timestamp)) {
      element.textContent = formatDateTime(timestamp * 1000);
    }
  });
}

// Function to submit the election form
async function submitElectionForm() {
  const electionStatus = document.getElementById('electionStatus');
  electionStatus.innerHTML = "<span style='color:var(--accent-color)'>Processing your request...</span>";
  document.getElementById('createElection').disabled = true;

  try {
    // Get form data
    const electionName = document.getElementById('electionName').value;
    const startDateInput = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate').value;

    if (!electionName || !startDateInput || !endDateInput) {
      electionStatus.innerHTML = "<span style='color:red'>Please fill in all required fields</span>";
      document.getElementById('createElection').disabled = false;
      return;
    }

    const startDate = new Date(startDateInput).getTime() / 1000;
    const endDate = new Date(endDateInput).getTime() / 1000;

    // Validate dates
    const now = Math.floor(Date.now() / 1000);
    if (startDate < now) {
      electionStatus.innerHTML = "<span style='color:red'>Start date must be in the future</span>";
      document.getElementById('createElection').disabled = false;
      return;
    }

    if (endDate <= startDate) {
      electionStatus.innerHTML = "<span style='color:red'>End date must be after start date</span>";
      document.getElementById('createElection').disabled = false;
      return;
    }

    // Collect all candidates
    const candidates = [];

    // First candidate
    const firstName = document.getElementById('name-1').value;
    const firstParty = document.getElementById('party-1').value;

    if (!firstName || !firstParty) {
      electionStatus.innerHTML = "<span style='color:red'>Please fill in the first candidate's information</span>";
      document.getElementById('createElection').disabled = false;
      return;
    }

    candidates.push({ name: firstName, party: firstParty });

    // Additional candidates
    for (let i = 2; i <= candidateCounter; i++) {
      const candidateElement = document.getElementById(`candidate-${i}`);
      if (candidateElement) {
        const name = document.getElementById(`name-${i}`).value;
        const party = document.getElementById(`party-${i}`).value;

        if (name && party) {
          candidates.push({ name, party });
        }
      }
    }

    if (candidates.length < 2) {
      electionStatus.innerHTML = "<span style='color:red'>Please add at least two candidates for the election</span>";
      document.getElementById('createElection').disabled = false;
      return;
    }

    // Call the contract functions through the global AdminApp object
    electionStatus.innerHTML = `<span style='color:var(--accent-color)'>Creating election "${electionName}"...</span>`;
    console.log("Creating election:", electionName, new Date(startDate * 1000), new Date(endDate * 1000));

    // Get the contract instance from the global AdminApp object
    const instance = await window.AdminApp.getInstance();

    // Create the election
    const result = await instance.createElection(electionName, startDate, endDate);
    console.log("Election created:", result);

    const electionId = result.logs[0].args.electionId.toNumber();
    electionStatus.innerHTML = `<span style='color:var(--accent-color)'>Election "${electionName}" created with ID: ${electionId}. Adding candidates...</span>`;

    // Add all candidates
    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      electionStatus.innerHTML = `<span style='color:var(--accent-color)'>Adding candidate ${i+1}/${candidates.length}: ${candidate.name}...</span>`;
      await instance.addCandidate(electionId, candidate.name, candidate.party);
    }

    electionStatus.innerHTML = `<span style='color:green'>Success! Election "${electionName}" created with ${candidates.length} candidates!</span>`;

    // Reset the form
    document.getElementById('electionForm').reset();
    document.getElementById('additionalCandidates').innerHTML = '';
    candidateCounter = 1;

    // Reload active elections
    await window.AdminApp.loadActiveElections(instance);

    // Set default dates again
    setDefaultDates();

  } catch (error) {
    console.error("Error creating election:", error);
    electionStatus.innerHTML = `<span style='color:red'>Error: ${error.message}</span>`;
  } finally {
    document.getElementById('createElection').disabled = false;
  }
}

// Function to view election results
async function viewElectionResults(electionId) {
  try {
    const instance = await window.AdminApp.getInstance();
    await window.AdminApp.viewElectionResults(instance, electionId);
  } catch (error) {
    console.error("Error viewing results:", error);
    alert("Error viewing results: " + error.message);
  }
}

// Function to view live tally
async function viewLiveTally(electionId) {
  try {
    const instance = await window.AdminApp.getInstance();
    await window.AdminApp.updateLiveTally(instance, electionId);
  } catch (error) {
    console.error("Error viewing live tally:", error);
    alert("Error viewing live tally: " + error.message);
  }
}

// Function to go back to elections list
async function backToElections() {
  try {
    const instance = await window.AdminApp.getInstance();
    await window.AdminApp.loadActiveElections(instance);
  } catch (error) {
    console.error("Error returning to elections list:", error);
    alert("Error returning to elections list: " + error.message);
  }
}

// Function to set default dates (2025)
function setDefaultDates() {
  const now = new Date();
  const nextYear = new Date(2025, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
  const nextYearEnd = new Date(2025, now.getMonth(), now.getDate() + 7, now.getHours(), now.getMinutes());

  // Format for datetime-local input: YYYY-MM-DDTHH:MM
  const startDateValue = nextYear.toISOString().slice(0, 16);
  const endDateValue = nextYearEnd.toISOString().slice(0, 16);

  document.getElementById('startDate').value = startDateValue;
  document.getElementById('endDate').value = endDateValue;
}

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set default dates for the form (2025)
  setDefaultDates();

  // Update any existing date displays
  updateDateDisplays();
});
