// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;
    constructor() { _status = _NOT_ENTERED; }
    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

contract GuestBook is ReentrancyGuard {
    struct Message {
        address sender;
        string message;
        string name;
        uint256 timestamp;
    }
    struct TodoItem {
        uint256 id;
        address creator;
        string title;
        string description;
        bool completed;
        uint256 likes;
        uint256 timestamp;
        bool exists;
    }

    Message[] private messages;
    address public owner;
    uint256 public todoCreationFee = 0.00001 ether;
    mapping(uint256 => TodoItem) public todos;
    mapping(address => uint256[]) private userTodos;
    mapping(uint256 => mapping(address => bool)) public todoLikes;
    uint256 public todoCounter;
    uint256[] private allTodoIds;

    event NewMessage(address indexed sender, string name, string message);
    event MessageDeleted(uint256 indexed index, address indexed sender);
    event TodoCreated(uint256 indexed todoId, address indexed creator, string title);
    event TodoCompleted(uint256 indexed todoId, bool completed);
    event TodoDeleted(uint256 indexed todoId, address indexed creator);
    event TodoLiked(uint256 indexed todoId, address indexed liker, bool liked);
    event FeeUpdated(uint256 newFee);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // --- Ownership Management ---
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    // --- Guestbook Functions ---

    function postMessage(string memory _name, string memory _message) public {
        require(bytes(_message).length > 0, "Empty message");
        require(bytes(_name).length > 0, "Empty name");
        messages.push(Message(msg.sender, _message, _name, block.timestamp));
        emit NewMessage(msg.sender, _name, _message);
    }

    function getTotalMessages() public view returns (uint256) {
        return messages.length;
    }

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

    function getAllMessages() public view returns (Message[] memory) {
        return messages;
    }

    // Optional: allow sender to delete their message (by blanking out the fields)
    function deleteMessage(uint256 index) public {
        require(index < messages.length, "Invalid index");
        require(messages[index].sender == msg.sender, "Not message sender");
        messages[index].message = "";
        messages[index].name = "";
        emit MessageDeleted(index, msg.sender);
    }

    // --- Todo Functions ---

    function createTodo(string memory _title, string memory _description) public payable nonReentrant {
        require(msg.value >= todoCreationFee, "Fee too low");
        require(bytes(_title).length > 0, "Empty title");
        require(bytes(_title).length <= 100, "Title too long");
        require(bytes(_description).length <= 500, "Description too long");

        uint256 todoId = todoCounter++;
        todos[todoId] = TodoItem(todoId, msg.sender, _title, _description, false, 0, block.timestamp, true);
        userTodos[msg.sender].push(todoId);
        allTodoIds.push(todoId);

        emit TodoCreated(todoId, msg.sender, _title);
    }

    function toggleTodoComplete(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo missing");
        require(todos[_todoId].creator == msg.sender, "Not todo creator");
        todos[_todoId].completed = !todos[_todoId].completed;
        emit TodoCompleted(_todoId, todos[_todoId].completed);
    }

    function deleteTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo missing");
        require(todos[_todoId].creator == msg.sender, "Not creator");
        todos[_todoId].exists = false;

        // Clean up from userTodos
        uint256[] storage ids = userTodos[msg.sender];
        for (uint256 i=0; i < ids.length; i++) {
            if (ids[i] == _todoId) {
                ids[i] = ids[ids.length - 1];
                ids.pop();
                break;
            }
        }
        // Clean up from allTodoIds
        for (uint256 i=0; i < allTodoIds.length; i++) {
            if (allTodoIds[i] == _todoId) {
                allTodoIds[i] = allTodoIds[allTodoIds.length - 1];
                allTodoIds.pop();
                break;
            }
        }

        emit TodoDeleted(_todoId, msg.sender);
    }

    function likeTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo missing");
        require(!todoLikes[_todoId][msg.sender], "Already liked");

        todos[_todoId].likes += 1;
        todoLikes[_todoId][msg.sender] = true;
        emit TodoLiked(_todoId, msg.sender, true);
    }

    function unlikeTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo missing");
        require(todoLikes[_todoId][msg.sender], "Not liked");
        require(todos[_todoId].likes > 0, "No likes to remove");

        todos[_todoId].likes -= 1;
        todoLikes[_todoId][msg.sender] = false;
        emit TodoLiked(_todoId, msg.sender, false);
    }

    function getTodo(uint256 _todoId) public view returns (
        uint256 id, address creator, string memory title, string memory description, bool completed, uint256 likes, uint256 timestamp, bool exists
    ) {
        TodoItem memory todo = todos[_todoId];
        return (todo.id, todo.creator, todo.title, todo.description, todo.completed, todo.likes, todo.timestamp, todo.exists);
    }

    function getAllTodos() public view returns (TodoItem[] memory) {
        uint256 count = 0;
        for (uint256 i=0; i < allTodoIds.length; i++) {
            if (todos[allTodoIds[i]].exists) count++;
        }
        TodoItem[] memory actives = new TodoItem[](count);
        uint256 idx = 0;
        for (uint256 i=0; i < allTodoIds.length; i++) {
            uint256 id = allTodoIds[i];
            if (todos[id].exists) {
                actives[idx++] = todos[id];
            }
        }
        return actives;
    }

    function getUserTodos(address _user) public view returns (TodoItem[] memory) {
        uint256[] memory ids = userTodos[_user];
        uint256 count = 0;
        for (uint256 i=0; i < ids.length; i++) {
            if (todos[ids[i]].exists) count++;
        }
        TodoItem[] memory actives = new TodoItem[](count);
        uint256 idx = 0;
        for (uint256 i=0; i < ids.length; i++) {
            if (todos[ids[i]].exists) {
                actives[idx++] = todos[ids[i]];
            }
        }
        return actives;
    }

    function hasLikedTodo(uint256 _todoId, address _user) public view returns (bool) {
        return todoLikes[_todoId][_user];
    }

    // --- Owner-only ---

    function updateTodoFee(uint256 _newFee) external onlyOwner {
        todoCreationFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function withdraw() external onlyOwner nonReentrant {
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}