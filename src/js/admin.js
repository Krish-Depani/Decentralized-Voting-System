const Web3 = require('web3');
const contract = require('@truffle/contract');

const electionFactoryArtifacts = require('../../build/contracts/ElectionFactory.json');
const ElectionFactory = contract(electionFactoryArtifacts);

window.AdminApp = {
  // Initialize properties
  account: null,
  tallyInterval: null,

  init: async function() {
    console.log("Starting admin application...");

    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined') {
      console.error("Metamask not detected! Please install Metamask.");
      alert("Metamask not detected! Please install Metamask extension and refresh the page.");
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Connected accounts:", accounts);

      if (accounts.length === 0) {
        console.error("No accounts found. Please unlock Metamask.");
        alert("No accounts found. Please unlock Metamask and refresh the page.");
        return;
      }

      // Set up contract provider
      ElectionFactory.setProvider(window.ethereum);
      ElectionFactory.defaults({from: window.ethereum.selectedAddress, gas: 6654755});

      // Load account data
      AdminApp.account = window.ethereum.selectedAddress;
      console.log("Using account:", AdminApp.account);
      $("#accountAddress").html("Your Account: " + AdminApp.account);

      // Get deployed contract instance
      this.contractInstance = await ElectionFactory.deployed();
      console.log("Contract deployed at:", this.contractInstance.address);
      $("#contractAddress").html("Contract Address: " + this.contractInstance.address);
      $("#debugInfo").html("Status: Connected to blockchain");

      // Set up event listeners
      AdminApp.setupEventListeners(this.contractInstance);

      // Load active elections
      await AdminApp.loadActiveElections(this.contractInstance);

      // Start the live tally update
      AdminApp.startLiveTallyUpdate(this.contractInstance);

      // Get network info
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      let networkName = "Unknown";
      switch(chainId) {
        case "0x1":
          networkName = "Ethereum Mainnet";
          break;
        case "0x3":
          networkName = "Ropsten Testnet";
          break;
        case "0x4":
          networkName = "Rinkeby Testnet";
          break;
        case "0x5":
          networkName = "Goerli Testnet";
          break;
        case "0x539":
          networkName = "Ganache Local";
          break;
        default:
          networkName = "Local Network (" + chainId + ")";
      }
      $("#networkInfo").html("Network: " + networkName);

      // Add Murang'a University branding
      document.title = "MUT Voting System - Admin Portal";

    } catch (error) {
      console.error("Error initializing application:", error);
      $("#debugInfo").html("Status: Error initializing - " + error.message);
    }
  },

  setupEventListeners: function(instance) {
    // Add more candidates button
    let candidateCounter = 1;

    $("#addMoreCandidates").click(function() {
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
                  <button type="button" class="remove-candidate" data-id="${candidateCounter}" style="margin-left: 10px;">✕</button>
                </div>
              </td>
            </tr>
          </table>
        </div>
      `;
      $("#additionalCandidates").append(newCandidateRow);
    });

    // Remove candidate button (using event delegation)
    $("#additionalCandidates").on("click", ".remove-candidate", function() {
      const candidateId = $(this).data("id");
      $(`#candidate-${candidateId}`).remove();
    });

    // Create election form submission
    $("#electionForm").submit(async function(event) {
      event.preventDefault();
      $("#electionStatus").html("<span style='color:var(--accent-color)'>Processing your request...</span>");
      $("#createElection").prop("disabled", true);

      try {
        // Get form data
        const electionName = $("#electionName").val();
        const startDate = new Date($("#startDate").val()).getTime() / 1000;
        const endDate = new Date($("#endDate").val()).getTime() / 1000;

        // Validate dates
        const now = Math.floor(Date.now() / 1000);
        if (startDate < now) {
          $("#electionStatus").html("<span style='color:red'>Start date must be in the future</span>");
          $("#createElection").prop("disabled", false);
          return;
        }

        if (endDate <= startDate) {
          $("#electionStatus").html("<span style='color:red'>End date must be after start date</span>");
          $("#createElection").prop("disabled", false);
          return;
        }

        // Collect all candidates
        const candidates = [];

        // First candidate
        const firstName = $("#name-1").val();
        const firstParty = $("#party-1").val();

        if (!firstName || !firstParty) {
          $("#electionStatus").html("<span style='color:red'>Please fill in the first candidate's information</span>");
          $("#createElection").prop("disabled", false);
          return;
        }

        candidates.push({ name: firstName, party: firstParty });

        // Additional candidates
        for (let i = 2; i <= candidateCounter; i++) {
          const candidateElement = $(`#candidate-${i}`);
          if (candidateElement.length) {
            const name = $(`#name-${i}`).val();
            const party = $(`#party-${i}`).val();

            if (name && party) {
              candidates.push({ name, party });
            }
          }
        }

        if (candidates.length < 2) {
          $("#electionStatus").html("<span style='color:red'>Please add at least two candidates for the election</span>");
          $("#createElection").prop("disabled", false);
          return;
        }

        // Create the election
        $("#electionStatus").html(`<span style='color:var(--accent-color)'>Creating election "${electionName}"...</span>`);
        console.log("Creating election:", electionName, new Date(startDate * 1000), new Date(endDate * 1000));
        const result = await instance.createElection(electionName, startDate, endDate);
        console.log("Election created:", result);

        const electionId = result.logs[0].args.electionId.toNumber();
        $("#electionStatus").html(`<span style='color:var(--accent-color)'>Election "${electionName}" created with ID: ${electionId}. Adding candidates...</span>`);

        // Add all candidates
        for (let i = 0; i < candidates.length; i++) {
          const candidate = candidates[i];
          $("#electionStatus").html(`<span style='color:var(--accent-color)'>Adding candidate ${i+1}/${candidates.length}: ${candidate.name}...</span>`);
          await instance.addCandidate(electionId, candidate.name, candidate.party);
        }

        $("#electionStatus").html(`<span style='color:green'>Success! Election "${electionName}" created with ${candidates.length} candidates!</span>`);

        // Reset the form
        $("#electionForm")[0].reset();
        $("#additionalCandidates").empty();
        candidateCounter = 1;

        // Reload active elections
        await AdminApp.loadActiveElections(instance);

        // Start the live tally update
        AdminApp.startLiveTallyUpdate(instance);

      } catch (error) {
        console.error("Error creating election:", error);
        $("#electionStatus").html(`<span style='color:red'>Error: ${error.message}</span>`);
      } finally {
        $("#createElection").prop("disabled", false);
      }
    });
  },

  loadActiveElections: async function(instance) {
    try {
      const electionCount = await instance.getElectionCount();
      console.log("Total elections:", electionCount.toNumber());

      if (electionCount.toNumber() === 0) {
        $("#activeElections").html("<p>No elections found. Create your first election above.</p>");
        return;
      }

      let electionsHtml = `
        <table class="elections-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Candidates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;

      const now = Math.floor(Date.now() / 1000);
      let hasActiveElection = false;

      for (let i = 1; i <= electionCount.toNumber(); i++) {
        const election = await instance.getElection(i);
        const id = election[0].toNumber();
        const name = election[1];
        const startTime = election[2].toNumber();
        const endTime = election[3].toNumber();
        const candidateCount = election[4].toNumber();

        let status = "Upcoming";
        if (now >= startTime && now < endTime) {
          status = "Active";
          hasActiveElection = true;
          // Update the live tally for this election
          AdminApp.updateLiveTally(instance, id);
        } else if (now >= endTime) {
          status = "Ended";
        }

        let statusClass = "";
        if (status === "Active") statusClass = "status-active";
        if (status === "Ended") statusClass = "status-ended";
        if (status === "Upcoming") statusClass = "status-upcoming";

        electionsHtml += `
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${new Date(startTime * 1000).toLocaleString()}</td>
            <td>${new Date(endTime * 1000).toLocaleString()}</td>
            <td><span class="${statusClass}">${status}</span></td>
            <td>${candidateCount}</td>
            <td>
              <button class="btn-view" data-id="${id}">View Results</button>
              ${status === "Active" ? `<button class="btn-live" data-id="${id}">Live Tally</button>` : ''}
            </td>
          </tr>
        `;
      }

      electionsHtml += `
          </tbody>
        </table>
      `;

      $("#activeElections").html(electionsHtml);

      // Buttons now use onclick handlers directly in the HTML

      if (!hasActiveElection) {
        $("#tallyMessage").show();
        $("#tallyCards").hide();
      }

    } catch (error) {
      console.error("Error loading elections:", error);
      $("#activeElections").html(`<p style='color:red'>Error loading elections: ${error.message}</p>`);
    }
  },

  startLiveTallyUpdate: function(instance) {
    // Clear any existing interval
    if (AdminApp.tallyInterval) {
      clearInterval(AdminApp.tallyInterval);
    }

    // Set up an interval to update the tally every 10 seconds
    AdminApp.tallyInterval = setInterval(async function() {
      try {
        const electionCount = await instance.getElectionCount();
        const now = Math.floor(Date.now() / 1000);

        // Find active elections
        for (let i = 1; i <= electionCount.toNumber(); i++) {
          const election = await instance.getElection(i);
          const id = election[0].toNumber();
          const startTime = election[2].toNumber();
          const endTime = election[3].toNumber();

          // Update tally for active elections
          if (now >= startTime && now < endTime) {
            await AdminApp.updateLiveTally(instance, id);
          }
        }
      } catch (error) {
        console.error("Error updating live tally:", error);
      }
    }, 10000); // Update every 10 seconds
  },

  updateLiveTally: async function(instance, electionId) {
    try {
      const election = await instance.getElection(electionId);
      const name = election[1];
      const candidateCount = election[4].toNumber();

      if (candidateCount === 0) {
        $("#tallyMessage").text("No candidates found for this election").show();
        $("#tallyCards").hide();
        return;
      }

      let candidates = [];
      let totalVotes = 0;

      // Get all candidates and their votes
      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await instance.getCandidate(electionId, i);
        const id = candidate[0].toNumber();
        const name = candidate[1];
        const party = candidate[2];
        const votes = candidate[3].toNumber();

        totalVotes += votes;
        candidates.push({ id, name, party, votes });
      }

      // Sort candidates by votes (descending)
      candidates.sort((a, b) => b.votes - a.votes);

      // Update the tally display
      $("#tallyMessage").hide();
      $("#tallyCards").show();

      let tallyHtml = `<h4 class="tally-title">Live Results: ${name}</h4>`;

      candidates.forEach(candidate => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;

        tallyHtml += `
          <div class="tally-card">
            <h4>${candidate.name}</h4>
            <div class="party">${candidate.party}</div>
            <div class="votes">${candidate.votes}</div>
            <div class="percentage">${percentage}%</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
          </div>
        `;
      });

      $("#tallyCards").html(tallyHtml);

    } catch (error) {
      console.error("Error updating live tally:", error);
      $("#tallyMessage").text(`Error updating tally: ${error.message}`).show();
      $("#tallyCards").hide();
    }
  },

  viewElectionResults: async function(instance, electionId) {
    try {
      const election = await instance.getElection(electionId);
      const name = election[1];
      const startTime = election[2].toNumber();
      const endTime = election[3].toNumber();
      const candidateCount = election[4].toNumber();

      let resultsHtml = `
        <h3>Results for "${name}"</h3>
        <p>Election period: ${new Date(startTime * 1000).toLocaleString()} - ${new Date(endTime * 1000).toLocaleString()}</p>
        <table class="results-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Party</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
      `;

      let totalVotes = 0;

      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await instance.getCandidate(electionId, i);
        const id = candidate[0].toNumber();
        const name = candidate[1];
        const party = candidate[2];
        const votes = candidate[3].toNumber();

        totalVotes += votes;

        resultsHtml += `
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${party}</td>
            <td>${votes}</td>
          </tr>
        `;
      }

      resultsHtml += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Votes:</td>
              <td>${totalVotes}</td>
            </tr>
          </tfoot>
        </table>
        <button id="backToElections" class="btn-secondary" onclick="backToElections()">Back to Elections</button>
      `;

      $("#activeElections").html(resultsHtml);
      // Back button now uses onclick handler directly in the HTML

    } catch (error) {
      console.error("Error viewing election results:", error);
      $("#activeElections").html(`<p style='color:red'>Error viewing results: ${error.message}</p>`);
    }
  }
};

// Listen for account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', function (accounts) {
    console.log('Account changed to:', accounts[0]);
    $('#accountAddress').html("Your Account: " + accounts[0]);
    $('#debugInfo').html("Status: Account changed. Refreshing page...");
    // Reload the page to update the interface
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  // Listen for chain changes
  window.ethereum.on('chainChanged', function (chainId) {
    console.log('Network changed to:', chainId);
    $('#debugInfo').html("Status: Network changed. Refreshing page...");
    // Reload the page to update the interface
    window.location.reload();
  });
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    window.eth = new Web3(window.ethereum)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
  }
  window.AdminApp.init();
});
