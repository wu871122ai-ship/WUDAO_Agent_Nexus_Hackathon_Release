// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Hackathon MVP: Agent-ID-gated task registry. No custody, no token payments.
interface IAgentID {
    function balanceOf(address owner) external view returns (uint256);
}

contract WUDAOAgentHub {
    IAgentID public immutable agentId;
    uint256 public taskCount;

    enum Status { Open, Accepted, Completed, Cancelled }
    struct Task {
        address creator;
        address worker;
        string title;
        string details;
        Status status;
        uint64 createdAt;
    }
    mapping(uint256 => Task) private tasks;

    event AgentIdChecked(address indexed account, bool eligible, uint256 balance);
    event TaskCreated(uint256 indexed taskId, address indexed creator, string title);
    event TaskAccepted(uint256 indexed taskId, address indexed worker);
    event TaskCompleted(uint256 indexed taskId, address indexed worker);
    event TaskCancelled(uint256 indexed taskId, address indexed creator);

    modifier hasAgentId() {
        uint256 bal = agentId.balanceOf(msg.sender);
        require(bal > 0, "Agent ID required");
        emit AgentIdChecked(msg.sender, true, bal);
        _;
    }

    constructor(address agentIdContract) {
        require(agentIdContract != address(0), "Invalid Agent ID contract");
        agentId = IAgentID(agentIdContract);
    }

    function verifyAgentId(address account) external view returns (bool) {
        return agentId.balanceOf(account) > 0;
    }

    function createTask(string calldata title, string calldata details) external hasAgentId returns (uint256 id) {
        require(bytes(title).length > 0 && bytes(title).length <= 120, "Title length");
        require(bytes(details).length > 0 && bytes(details).length <= 2000, "Details length");
        id = ++taskCount;
        tasks[id] = Task(msg.sender, address(0), title, details, Status.Open, uint64(block.timestamp));
        emit TaskCreated(id, msg.sender, title);
    }

    function acceptTask(uint256 id) external hasAgentId {
        Task storage t = tasks[id];
        require(t.creator != address(0), "Task not found");
        require(t.status == Status.Open, "Not open");
        require(msg.sender != t.creator, "Creator cannot accept");
        t.worker = msg.sender;
        t.status = Status.Accepted;
        emit TaskAccepted(id, msg.sender);
    }

    function completeTask(uint256 id) external hasAgentId {
        Task storage t = tasks[id];
        require(t.status == Status.Accepted, "Not accepted");
        require(msg.sender == t.worker, "Only worker");
        t.status = Status.Completed;
        emit TaskCompleted(id, msg.sender);
    }

    function cancelTask(uint256 id) external hasAgentId {
        Task storage t = tasks[id];
        require(t.creator == msg.sender, "Only creator");
        require(t.status == Status.Open, "Cannot cancel");
        t.status = Status.Cancelled;
        emit TaskCancelled(id, msg.sender);
    }

    function getTask(uint256 id) external view returns (
        address creator, address worker, string memory title, string memory details, Status status, uint64 createdAt
    ) {
        Task storage t = tasks[id];
        require(t.creator != address(0), "Task not found");
        return (t.creator, t.worker, t.title, t.details, t.status, t.createdAt);
    }
}