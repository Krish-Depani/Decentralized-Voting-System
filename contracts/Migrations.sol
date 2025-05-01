pragma solidity ^0.5.15;

contract Migrations {
    address public owner;
    uint public last_completed_migration;

    // Restricts access to only the contract owner
    modifier restricted() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    // Sets the last completed migration step
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }

    // Upgrades the contract to a new address and preserves migration state
    function upgrade(address new_address) public restricted {
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}
