const Web3 = require('web3');
const contract = require('@truffle/contract');

const electionFactoryArtifacts = require('../../build/contracts/ElectionFactory.json');
const ElectionFactory = contract(electionFactoryArtifacts);

window.VoterApp = {
  init: async function() {
    console.log("Starting voter application...");
    
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
      VoterApp.account = window.ethereum.selectedAddress;
      console.log("Using account:", VoterApp.account);
      $("#accountAddress").html("Your Account: " + VoterApp.account);
      
      // Get deployed contract instance
      const instance = await ElectionFactory.deployed();
      console.log("Contract deployed at:", instance.address);
      $("#contractAddress").html("Contract Address: " + instance.address);
      $("#debugInfo").html("Status: Connected to blockchain");
      
      // Load active elections
      await VoterApp.loadActiveElections(instance);
      
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
      
    } catch (error) {
      console.error("Error initializing application:", error);
      $("#debugInfo").html("Status: Error initializing - " + error.message);
    }
  },
  
  loadActiveElections: async function(instance) {
    try {
      const electionCount = await instance.getElectionCount();
      console.log("Total elections:", electionCount.toNumber());
      
      if (electionCount.toNumber() === 0) {
        $("#activeElections").html("<p>No elections found. Please check back later.</p>");
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      const now = Math.floor(Date.now() / 1000);
      
      for (let i = 1; i <= electionCount.toNumber(); i++) {
        const election = await instance.getElection(i);
        const id = election[0].toNumber();
        const name = election[1];
        const startTime = election[2].toNumber();
        const endTime = election[3].toNumber();
        
        let status = "Upcoming";
        let actionButton = "";
        
        if (now >= startTime && now < endTime) {
          status = "Active";
          
          // Check if user has already voted
          const hasVoted = await instance.hasVoted(id);
          
          if (hasVoted) {
            actionButton = `<button class="btn-voted" disabled>Already Voted</button>`;
          } else {
            actionButton = `<button class="btn-vote" data-id="${id}">Vote Now</button>`;
          }
        } else if (now >= endTime) {
          status = "Ended";
          actionButton = `<button class="btn-view" data-id="${id}">View Results</button>`;
        } else {
          actionButton = `<span>Not started yet</span>`;
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
            <td>${actionButton}</td>
          </tr>
        `;
      }
      
      electionsHtml += `
          </tbody>
        </table>
      `;
      
      $("#activeElections").html(electionsHtml);
      
      // Add event listeners for buttons
      $(".btn-vote").click(async function() {
        const electionId = $(this).data("id");
        await VoterApp.showVotingBallot(instance, electionId);
      });
      
      $(".btn-view").click(async function() {
        const electionId = $(this).data("id");
        await VoterApp.viewElectionResults(instance, electionId);
      });
      
    } catch (error) {
      console.error("Error loading elections:", error);
      $("#activeElections").html(`<p style='color:red'>Error loading elections: ${error.message}</p>`);
    }
  },
  
  showVotingBallot: async function(instance, electionId) {
    try {
      const election = await instance.getElection(electionId);
      const name = election[1];
      const startTime = election[2].toNumber();
      const endTime = election[3].toNumber();
      const candidateCount = election[4].toNumber();
      
      let ballotHtml = `
        <h3>Vote in "${name}"</h3>
        <p>Election period: ${new Date(startTime * 1000).toLocaleString()} - ${new Date(endTime * 1000).toLocaleString()}</p>
        <form id="voteForm">
          <div class="candidates-list">
      `;
      
      for (let i = 1; i <= candidateCount; i++) {
        const candidate = await instance.getCandidate(electionId, i);
        const id = candidate[0].toNumber();
        const name = candidate[1];
        const party = candidate[2];
        
        ballotHtml += `
          <div class="candidate-option">
            <input type="radio" name="candidateId" id="candidate-${id}" value="${id}" required>
            <label for="candidate-${id}">
              <strong>${name}</strong> (${party})
            </label>
          </div>
        `;
      }
      
      ballotHtml += `
          </div>
          <div class="form-actions">
            <input type="hidden" id="electionId" value="${electionId}">
            <button type="submit" id="submitVote" class="btn-primary">Submit Vote</button>
            <button type="button" id="cancelVote" class="btn-secondary">Cancel</button>
          </div>
          <div id="voteStatus"></div>
        </form>
      `;
      
      $("#activeElections").html(ballotHtml);
      
      // Add event listeners
      $("#voteForm").submit(async function(event) {
        event.preventDefault();
        await VoterApp.submitVote(instance);
      });
      
      $("#cancelVote").click(async function() {
        await VoterApp.loadActiveElections(instance);
      });
      
    } catch (error) {
      console.error("Error showing ballot:", error);
      $("#activeElections").html(`<p style='color:red'>Error showing ballot: ${error.message}</p>`);
    }
  },
  
  submitVote: async function(instance) {
    try {
      $("#voteStatus").html("Processing your vote...");
      $("#submitVote").prop("disabled", true);
      
      const electionId = parseInt($("#electionId").val());
      const candidateId = parseInt($("input[name='candidateId']:checked").val());
      
      console.log("Submitting vote for candidate", candidateId, "in election", electionId);
      
      const result = await instance.vote(electionId, candidateId);
      console.log("Vote transaction:", result);
      
      $("#voteStatus").html(`<p style='color:green'>Your vote has been recorded successfully!</p>`);
      
      // Show transaction details
      const txHash = result.tx;
      $("#voteStatus").append(`<p>Transaction hash: ${txHash}</p>`);
      
      // Reload after 3 seconds
      setTimeout(async function() {
        await VoterApp.loadActiveElections(instance);
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting vote:", error);
      $("#voteStatus").html(`<p style='color:red'>Error: ${error.message}</p>`);
      $("#submitVote").prop("disabled", false);
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
      let candidates = [];
      
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
      
      candidates.forEach(candidate => {
        const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : 0;
        
        resultsHtml += `
          <tr>
            <td>${candidate.id}</td>
            <td>${candidate.name}</td>
            <td>${candidate.party}</td>
            <td>${candidate.votes} (${percentage}%)</td>
          </tr>
        `;
      });
      
      resultsHtml += `
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Total Votes:</td>
              <td>${totalVotes}</td>
            </tr>
          </tfoot>
        </table>
        <button id="backToElections" class="btn-secondary">Back to Elections</button>
      `;
      
      $("#activeElections").html(resultsHtml);
      
      // Add event listener for back button
      $("#backToElections").click(async function() {
        await VoterApp.loadActiveElections(instance);
      });
      
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
  window.VoterApp.init();
});
