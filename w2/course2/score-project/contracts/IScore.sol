//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

interface IScore {
    function getScore(address _student) external view returns (uint);
    function setScore(address _student, uint _score) external;
}
