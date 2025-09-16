pragma solidity ^0.5.15;

contract ElectionFactory {
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }
    
    struct Election {
        uint id;
        string name;
        uint256 startTime;
        uint256 endTime;
        uint candidateCount;
        bool exists;
        mapping(uint => Candidate) candidates;
        mapping(address => bool) voters;
    }
    
    uint public electionCount;
    mapping(uint => Election) public elections;
    
    event ElectionCreated(uint electionId, string name, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint electionId, uint candidateId, string name, string party);
    event VoteCast(uint electionId, uint candidateId, address voter);
    
    // Create a new election
    function createElection(string memory _name, uint256 _startTime, uint256 _endTime) public returns (uint) {
        require(_startTime < _endTime, "End time must be after start time");
        
        electionCount++;
        
        Election storage newElection = elections[electionCount];
        newElection.id = electionCount;
        newElection.name = _name;
        newElection.startTime = _startTime;
        newElection.endTime = _endTime;
        newElection.candidateCount = 0;
        newElection.exists = true;
        
        emit ElectionCreated(electionCount, _name, _startTime, _endTime);
        
        return electionCount;
    }
    
    // Add a candidate to an election
    function addCandidate(uint _electionId, string memory _name, string memory _party) public returns (uint) {
        require(elections[_electionId].exists, "Election does not exist");
        
        Election storage election = elections[_electionId];
        election.candidateCount++;
        
        election.candidates[election.candidateCount] = Candidate(
            election.candidateCount,
            _name,
            _party,
            0
        );
        
        emit CandidateAdded(_electionId, election.candidateCount, _name, _party);
        
        return election.candidateCount;
    }
    
    // Vote for a candidate in an election
    function vote(uint _electionId, uint _candidateId) public {
        Election storage election = elections[_electionId];
        
        require(election.exists, "Election does not exist");
        require(_candidateId > 0 && _candidateId <= election.candidateCount, "Invalid candidate");
        require(election.startTime <= now && election.endTime > now, "Election is not active");
        require(!election.voters[msg.sender], "You have already voted in this election");
        
        election.voters[msg.sender] = true;
        election.candidates[_candidateId].voteCount++;
        
        emit VoteCast(_electionId, _candidateId, msg.sender);
    }
    
    // Check if a voter has already voted in an election
    function hasVoted(uint _electionId) public view returns (bool) {
        require(elections[_electionId].exists, "Election does not exist");
        return elections[_electionId].voters[msg.sender];
    }
    
    // Get election details
    function getElection(uint _electionId) public view returns (uint, string memory, uint256, uint256, uint) {
        require(elections[_electionId].exists, "Election does not exist");
        Election storage election = elections[_electionId];
        return (
            election.id,
            election.name,
            election.startTime,
            election.endTime,
            election.candidateCount
        );
    }
    
    // Get candidate details
    function getCandidate(uint _electionId, uint _candidateId) public view returns (uint, string memory, string memory, uint) {
        require(elections[_electionId].exists, "Election does not exist");
        require(_candidateId > 0 && _candidateId <= elections[_electionId].candidateCount, "Invalid candidate");
        
        Candidate storage candidate = elections[_electionId].candidates[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.party,
            candidate.voteCount
        );
    }
    
    // Get the number of elections
    function getElectionCount() public view returns (uint) {
        return electionCount;
    }
    
    // Get the number of candidates in an election
    function getCandidateCount(uint _electionId) public view returns (uint) {
        require(elections[_electionId].exists, "Election does not exist");
        return elections[_electionId].candidateCount;
    }
    
    // Check if an election is active
    function isElectionActive(uint _electionId) public view returns (bool) {
        require(elections[_electionId].exists, "Election does not exist");
        return (elections[_electionId].startTime <= now && elections[_electionId].endTime > now);
    }
}
