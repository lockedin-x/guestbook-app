// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract GuestBook {
    // GUESTBOOK STRUCTS
    struct Message {
        address sender;
        string message;
        string name;
        uint256 timestamp;
    }

    // TODO LIST STRUCTS
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

    // STATE VARIABLES
    Message[] public messages;
    address public owner;
    uint256 public todoCreationFee = 0.00001 ether; // Very low fee

    // Todo mappings
    mapping(uint256 => TodoItem) public todos;
    mapping(address => uint256[]) public userTodos;
    mapping(uint256 => mapping(address => bool)) public todoLikes; // todoId => user => hasLiked
    uint256 public todoCounter;
    uint256[] public allTodoIds;

    // EVENTS
    event NewMessage(address indexed sender, string name, string message);
    event TodoCreated(uint256 indexed todoId, address indexed creator, string title);
    event TodoCompleted(uint256 indexed todoId, bool completed);
    event TodoDeleted(uint256 indexed todoId, address indexed creator);
    event TodoLiked(uint256 indexed todoId, address indexed liker, bool liked);
    event FeeUpdated(uint256 newFee);

    constructor() {
        owner = msg.sender;
    }

    // GUESTBOOK FUNCTIONS
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

    // TODO LIST FUNCTIONS
    function createTodo(string memory _title, string memory _description) public payable {
        require(msg.value >= todoCreationFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_title).length <= 100, "Title too long");
        require(bytes(_description).length <= 500, "Description too long");

        uint256 todoId = todoCounter;
        todoCounter++;

        todos[todoId] = TodoItem({
            id: todoId,
            creator: msg.sender,
            title: _title,
            description: _description,
            completed: false,
            likes: 0,
            timestamp: block.timestamp,
            exists: true
        });

        userTodos[msg.sender].push(todoId);
        allTodoIds.push(todoId);

        emit TodoCreated(todoId, msg.sender, _title);
    }

    function toggleTodoComplete(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo does not exist");
        require(todos[_todoId].creator == msg.sender, "Not todo creator");

        todos[_todoId].completed = !todos[_todoId].completed;
        emit TodoCompleted(_todoId, todos[_todoId].completed);
    }

    function deleteTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo does not exist");
        require(todos[_todoId].creator == msg.sender, "Not todo creator");

        todos[_todoId].exists = false;
        emit TodoDeleted(_todoId, msg.sender);
    }

    function likeTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo does not exist");
        require(!todoLikes[_todoId][msg.sender], "Already liked");

        todos[_todoId].likes++;
        todoLikes[_todoId][msg.sender] = true;
        emit TodoLiked(_todoId, msg.sender, true);
    }

    function unlikeTodo(uint256 _todoId) public {
        require(todos[_todoId].exists, "Todo does not exist");
        require(todoLikes[_todoId][msg.sender], "Not liked yet");

        todos[_todoId].likes--;
        todoLikes[_todoId][msg.sender] = false;
        emit TodoLiked(_todoId, msg.sender, false);
    }

    function getTodo(uint256 _todoId) public view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        bool completed,
        uint256 likes,
        uint256 timestamp,
        bool exists
    ) {
        TodoItem memory todo = todos[_todoId];
        return (
            todo.id,
            todo.creator,
            todo.title,
            todo.description,
            todo.completed,
            todo.likes,
            todo.timestamp,
            todo.exists
        );
    }

    function getAllTodos() public view returns (TodoItem[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allTodoIds.length; i++) {
            if (todos[allTodoIds[i]].exists) {
                activeCount++;
            }
        }

        TodoItem[] memory activeTodos = new TodoItem[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allTodoIds.length; i++) {
            if (todos[allTodoIds[i]].exists) {
                activeTodos[index] = todos[allTodoIds[i]];
                index++;
            }
        }

        return activeTodos;
    }

    function getUserTodos(address _user) public view returns (TodoItem[] memory) {
        uint256[] memory userTodoIds = userTodos[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < userTodoIds.length; i++) {
            if (todos[userTodoIds[i]].exists) {
                activeCount++;
            }
        }

        TodoItem[] memory userActiveTodos = new TodoItem[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < userTodoIds.length; i++) {
            if (todos[userTodoIds[i]].exists) {
                userActiveTodos[index] = todos[userTodoIds[i]];
                index++;
            }
        }

        return userActiveTodos;
    }

    function hasLikedTodo(uint256 _todoId, address _user) public view returns (bool) {
        return todoLikes[_todoId][_user];
    }

    // OWNER FUNCTIONS
    function updateTodoFee(uint256 _newFee) public {
        require(msg.sender == owner, "Only owner can update fee");
        todoCreationFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
