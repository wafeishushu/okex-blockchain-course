//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./Score.sol";
import "./IScore.sol";

contract Teacher {
    address public scoreAddress;

    function createNewScoreContract() public {
        Score score = new Score();
        scoreAddress = address(score);
    }

    function getScore(address _student) external view returns (uint) {
        return IScore(scoreAddress).getScore(_student);
    }

    function setScore(address _student, uint _score) external {
        IScore(scoreAddress).setScore(_student, _score);
    }
}