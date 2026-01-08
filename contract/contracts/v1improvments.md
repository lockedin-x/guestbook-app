Improvements & Approach
Fix underflows by checking likes before decrementing, and default to Solidity 0.8+ overflow/underflow protection.
Add a ReentrancyGuard for payable functions.
Add an onlyOwner modifier for clarity, allow ownership transfer/renounce.
Aggressively clean up deleted todos from all references to prevent storage bloat and ghost todos.
Add event for todo unlikes for easier tracking.
Include deleteMessage for message removal by user (optional).