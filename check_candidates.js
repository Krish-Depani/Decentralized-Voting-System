const Voting = artifacts.require("Voting");

module.exports = async function(callback) {
  try {
    // Get the deployed contract
    const voting = await Voting.deployed();
    console.log("Contract address:", voting.address);
    
    // Get the number of candidates
    const count = await voting.getCountCandidates();
    console.log("Number of candidates:", count.toNumber());
    
    // Get information about each candidate
    if (count > 0) {
      console.log("\nCandidates:");
      for (let i = 1; i <= count; i++) {
        const candidate = await voting.getCandidate(i);
        console.log(`ID: ${candidate[0].toNumber()}, Name: ${candidate[1]}, Party: ${candidate[2]}, Votes: ${candidate[3].toNumber()}`);
      }
    } else {
      console.log("No candidates found. Try adding some through the admin interface.");
    }
    
    // Get voting dates
    const dates = await voting.getDates();
    const startDate = new Date(dates[0].toNumber() * 1000);
    const endDate = new Date(dates[1].toNumber() * 1000);
    
    if (dates[0].toNumber() > 0 && dates[1].toNumber() > 0) {
      console.log("\nVoting period:");
      console.log("Start date:", startDate.toLocaleString());
      console.log("End date:", endDate.toLocaleString());
    } else {
      console.log("\nVoting period has not been set yet.");
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  callback();
};
