pragma solidity ^0.5.15;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        string party; 
        uint voteCount;
    }

    mapping (uint => Candidate) public candidates;
    mapping (address => bool) public voters;

    uint public countCandidates;
    uint256 public votingEnd;
    uint256 public votingStart;

    function addCandidate(string memory name, string memory party) public returns (uint) {
        countCandidates++;
        candidates[countCandidates] = Candidate(countCandidates, name, party, 0);
        return countCandidates;
    }

    function vote(uint candidateID) public {
        require((votingStart <= now) && (votingEnd > now), "Voting is not active.");
        require(candidateID > 0 && candidateID <= countCandidates, "Invalid candidate ID.");
        require(!voters[msg.sender], "You have already voted."); // must not have voted before

        voters[msg.sender] = true;
        ++candidates[candidateID].voteCount;
    }

    function checkVote() public view returns (bool) {
        return voters[msg.sender];
    }

    function getCountCandidates() public view returns (uint) {
        return countCandidates;
    }

    function getCandidate(uint candidateID) public view returns (
        uint, string memory, string memory, uint
    ) {
        Candidate memory c = candidates[candidateID];
        return (c.id, c.name, c.party, c.voteCount);
    }

    function setDates(uint256 _startDate, uint256 _endDate) public {
        require(
            votingEnd == 0 && votingStart == 0 &&
            _startDate + 1000000 > now && 
            _endDate > _startDate,
            "Invalid voting dates."
        );
        votingStart = _startDate;
        votingEnd = _endDate;
    }

    function getDates() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }
}
