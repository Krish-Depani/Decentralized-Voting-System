//import "../css/style.css"

const Web3 = require('web3');
const contract = require('@truffle/contract');

const votingArtifacts = require('../../build/contracts/Voting.json');
var VotingContract = contract(votingArtifacts)


window.App = {
  eventStart: function() {
    console.log("Starting application...");

    // Check if Metamask is installed
    if (typeof window.ethereum === 'undefined') {
      console.error("Metamask not detected! Please install Metamask.");
      alert("Metamask not detected! Please install Metamask extension and refresh the page.");
      return;
    }

    // Request account access
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log("Connected accounts:", accounts);
        if (accounts.length === 0) {
          console.error("No accounts found. Please unlock Metamask.");
          alert("No accounts found. Please unlock Metamask and refresh the page.");
          return;
        }
      })
      .catch(error => {
        console.error("Error connecting to Metamask:", error);
        alert("Error connecting to Metamask: " + error.message);
        return;
      });

    // Set up contract provider
    try {
      VotingContract.setProvider(window.ethereum);
      VotingContract.defaults({from: window.ethereum.selectedAddress, gas: 6654755});

      // Load account data
      App.account = window.ethereum.selectedAddress;
      console.log("Using account:", App.account);
      $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);
    } catch (error) {
      console.error("Error setting up contract:", error);
      alert("Error setting up contract: " + error.message);
      return;
    }
    // Get deployed contract instance
    VotingContract.deployed()
      .then(function(instance){
        console.log("Contract deployed at:", instance.address);
        $("#contractAddress").html("Contract Address: " + instance.address);
        $("#debugInfo").html("Status: Connected to blockchain");

        // Get candidate count
        return instance.getCountCandidates()
          .then(function(countCandidates){
            console.log("Number of candidates:", countCandidates.toNumber());
            $("#candidateCount").html("Candidates: " + countCandidates.toNumber());

            $(document).ready(function(){
              // Handle account switching
              $('#switchAccountBtn').click(function() {
                console.log("Switch account button clicked");
                $('#debugInfo').html("Status: Requesting account switch...");

                window.ethereum.request({
                  method: 'wallet_requestPermissions',
                  params: [{ eth_accounts: {} }],
                })
                .then((permissions) => {
                  const accountsPermission = permissions.find(
                    (permission) => permission.parentCapability === 'eth_accounts'
                  );
                  if (accountsPermission) {
                    console.log('eth_accounts permission successfully requested');
                    window.ethereum.request({ method: 'eth_requestAccounts' })
                      .then(accounts => {
                        console.log("Switched to account:", accounts[0]);
                        $('#accountAddress').html("Your Account: " + accounts[0]);
                        $('#debugInfo').html("Status: Account switched. Please refresh the page.");
                        alert("Account switched to " + accounts[0] + ". Please refresh the page to update the interface.");
                      });
                  }
                })
                .catch((error) => {
                  console.error("Error switching account:", error);
                  $('#debugInfo').html("Status: Error switching account: " + error.message);
                });
              });

              // Handle page refresh
              $('#refreshPageBtn').click(function() {
                console.log("Refresh page button clicked");
                window.location.reload();
              });

              // Check network
              window.ethereum.request({ method: 'eth_chainId' })
                .then(chainId => {
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
                  $('#networkInfo').html("Network: " + networkName);
                })
                .catch(error => {
                  console.error("Error getting network:", error);
                  $('#networkInfo').html("Network: Error getting network");
                });

              // Handle adding candidate
              $('#addCandidate').click(function() {
                  console.log("Add Candidate button clicked");
                  var nameCandidate = $('#name').val();
                  var partyCandidate = $('#party').val();

                  if (!nameCandidate || !partyCandidate) {
                    alert("Please enter both name and party for the candidate");
                    return;
                  }

                  console.log("Adding candidate:", nameCandidate, partyCandidate);
                  console.log("Using account:", window.ethereum.selectedAddress);

                  try {
                    instance.addCandidate(nameCandidate, partyCandidate)
                      .then(function(result){
                        console.log("Candidate added successfully:", result);
                        alert("Candidate added successfully!");
                        // Reload the page to show the new candidate
                        window.location.reload();
                      })
                      .catch(function(err){
                        console.error("Error adding candidate:", err);
                        alert("Error adding candidate: " + err.message);
                      });
                  } catch (error) {
                    console.error("Exception when adding candidate:", error);
                    alert("Exception when adding candidate: " + error.message);
                  }
            });

              $('#addDate').click(function(){
                  console.log("Define Date button clicked");
                  var startDateValue = document.getElementById("startDate").value;
                  var endDateValue = document.getElementById("endDate").value;

                  if (!startDateValue || !endDateValue) {
                    alert("Please select both start and end dates");
                    return;
                  }

                  var startDate = Date.parse(startDateValue)/1000;
                  var endDate = Date.parse(endDateValue)/1000;

                  console.log("Setting dates:", new Date(startDate*1000), new Date(endDate*1000));
                  console.log("Using account:", window.ethereum.selectedAddress);

                  try {
                    instance.setDates(startDate, endDate)
                      .then(function(result){
                        console.log("Dates set successfully:", result);
                        alert("Voting dates set successfully!");
                        // Reload the page to show the new dates
                        window.location.reload();
                      })
                      .catch(function(err){
                        console.error("Error setting dates:", err);
                        alert("Error setting dates: " + err.message);
                      });
                  } catch (error) {
                    console.error("Exception when setting dates:", error);
                    alert("Exception when setting dates: " + error.message);
                  }
              });

               instance.getDates().then(function(result){
                var startDate = new Date(result[0]*1000);
                var endDate = new Date(result[1]*1000);

                $("#dates").text( startDate.toDateString(("#DD#/#MM#/#YYYY#")) + " - " + endDate.toDateString("#DD#/#MM#/#YYYY#"));
              }).catch(function(err){
                console.error("ERROR! " + err.message)
              });
          });

          for (var i = 0; i < countCandidates; i++ ){
            instance.getCandidate(i+1).then(function(data){
              var id = data[0];
              var name = data[1];
              var party = data[2];
              var voteCount = data[3];
              var viewCandidates = `<tr><td> <input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>` + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
              $("#boxCandidate").append(viewCandidates)
            })
        }

        window.countCandidates = countCandidates
      });

      instance.checkVote().then(function (voted) {
          console.log(voted);
          if(!voted)  {
            $("#voteButton").attr("disabled", false);

          }
      });

    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })
  },

  vote: function() {
    console.log("Vote button clicked");
    $("#msg").html("<p>Processing your vote...</p>");

    var candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>");
      return;
    }

    console.log("Voting for candidate ID:", candidateID);
    console.log("Using account:", window.ethereum.selectedAddress);

    try {
      VotingContract.deployed().then(function(instance){
        console.log("Contract instance obtained");

        // Check if voting is currently allowed
        instance.getDates().then(function(dates) {
          const now = Math.floor(Date.now() / 1000);
          const startDate = dates[0].toNumber();
          const endDate = dates[1].toNumber();

          console.log("Current time:", new Date(now * 1000));
          console.log("Voting start:", new Date(startDate * 1000));
          console.log("Voting end:", new Date(endDate * 1000));

          if (now < startDate) {
            $("#msg").html(`<p style='color:red'>Voting has not started yet. Starts on ${new Date(startDate * 1000).toLocaleString()}</p>`);
            return;
          }

          if (now > endDate) {
            $("#msg").html(`<p style='color:red'>Voting has ended on ${new Date(endDate * 1000).toLocaleString()}</p>`);
            return;
          }

          // Check if user has already voted
          instance.checkVote().then(function(hasVoted) {
            console.log("Has already voted:", hasVoted);

            if (hasVoted) {
              $("#msg").html("<p style='color:orange'>You have already voted!</p>");
              $("#voteButton").attr("disabled", true);
              return;
            }

            // Submit the vote
            instance.vote(parseInt(candidateID), {from: window.ethereum.selectedAddress})
              .then(function(result){
                console.log("Vote transaction successful:", result);
                $("#voteButton").attr("disabled", true);
                $("#msg").html("<p style='color:green'>Your vote has been recorded successfully!</p>");

                // Show transaction details
                const txHash = result.tx;
                $("#msg").append(`<p>Transaction hash: <a href='https://localhost:7545/tx/${txHash}' target='_blank'>${txHash}</a></p>`);

                // Reload after 3 seconds
                setTimeout(function() {
                  window.location.reload();
                }, 3000);
              })
              .catch(function(err){
                console.error("Error submitting vote:", err);
                $("#msg").html(`<p style='color:red'>Error: ${err.message}</p>`);
              });
          }).catch(function(err){
            console.error("Error checking if already voted:", err);
            $("#msg").html(`<p style='color:red'>Error checking vote status: ${err.message}</p>`);
          });
        }).catch(function(err){
          console.error("Error getting voting dates:", err);
          $("#msg").html(`<p style='color:red'>Error getting voting dates: ${err.message}</p>`);
        });
      }).catch(function(err){
        console.error("Error getting contract instance:", err);
        $("#msg").html(`<p style='color:red'>Error getting contract: ${err.message}</p>`);
      });
    } catch (error) {
      console.error("Exception in vote function:", error);
      $("#msg").html(`<p style='color:red'>Exception: ${error.message}</p>`);
    }
  }
}

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
  window.App.eventStart()
})
