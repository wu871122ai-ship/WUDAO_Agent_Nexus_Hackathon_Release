// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
/// @dev Test-only mock. Never deploy this as the official Agent ID contract.
contract MockAgentID {
 mapping(address=>uint256) public balanceOf;
 function setHolder(address who,bool yes) external { balanceOf[who]=yes?1:0; }
}