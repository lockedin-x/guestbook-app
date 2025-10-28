// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract GuestBook {
    struct Message {
        address sender;
        string message;
        string name;
        uint256 timestamp;
    }
    
    Message[] public messages;
    address public owner;
    
    event NewMessage(address indexed sender, string name, string message);
    
    constructor() {
        owner = msg.sender;
    }
    
    // Anyone can post a message
    function postMessage(string memory _name, string memory _message) public {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        messages.push(Message({
            sender: msg.sender,
            message: _message,
            name: _name,
            timestamp: block.timestamp
        }));
        
        emit NewMessage(msg.sender, _name, _message);
    }
    
    // Get total messages
    function getTotalMessages() public view returns (uint256) {
        return messages.length;
    }
    
    // Get a specific message
    function getMessage(uint256 index) public view returns (
        address sender,
        string memory name,
        string memory message,
        uint256 timestamp
    ) {
        require(index < messages.length, "Invalid index");
        Message memory m = messages[index];
        return (m.sender, m.name, m.message, m.timestamp);
    }
    
    // Get all messages
    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }
}