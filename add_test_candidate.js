const Voting = artifacts.require("Voting");

module.exports = async function(callback) {
  try {
    // Get the deployed contract
    const voting = await Voting.deployed();
    console.log("Contract address:", voting.address);
    
    // Add a test candidate
    console.log("Adding test candidate...");
    const result = await voting.addCandidate("Test Candidate", "Test Party");
    console.log("Transaction hash:", result.tx);
    
    // Get the updated number of candidates
    const count = await voting.getCountCandidates();
    console.log("Number of candidates after adding:", count.toNumber());
    
    // Get information about the added candidate
    if (count > 0) {
      const candidate = await voting.getCandidate(count);
      console.log(`Added candidate - ID: ${candidate[0].toNumber()}, Name: ${candidate[1]}, Party: ${candidate[2]}, Votes: ${candidate[3].toNumber()}`);
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
  
  callback();
};
