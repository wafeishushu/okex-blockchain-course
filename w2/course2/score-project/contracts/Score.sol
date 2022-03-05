//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

contract Score {
    address public teacher;
    mapping(address => uint) public scoreMap;

    constructor() {
        teacher = msg.sender;
    }

    modifier onlyTeacher() {
        require(msg.sender == teacher, "Not teacher");
        _;
    }

    modifier validScore(uint _score) {
        require(_score <= 100, "Not valid score");
        _;
    }

    function getScore(address _student) external view returns (uint) {
        return scoreMap[_student];
    }

    function setScore(address _student, uint _score) onlyTeacher validScore(_score) external {
        scoreMap[_student] = _score;
    }
}
