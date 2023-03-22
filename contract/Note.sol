// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Note {
    // Notes can be done here
    string note;
    // Access modifier
    // privare publick external internal
    

    event NoteAdded(address noteSender, string addedNote);

    // для всех непреметивных типов локальных переменных используем memory
    function setNote(string memory _note) public {
        note = _note;
        // user who calls a funtion
        emit NoteAdded(msg.sender, _note);
    }

    // state mutabilit => pure, view, payable, non payable

    function getNote() public view returns (string memory) {
        return note;
    }

}


