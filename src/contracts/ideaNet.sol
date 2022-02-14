pragma solidity ^0.8.11;

contract ideaNet {
  uint public ideaCount = 0;
  string public name = "ideaNet";
  mapping(uint => Idea) public ideas;

  struct Idea {
    uint id;
    string hash;
    string title;
    address author;
  }

  event IdeaUploaded(
    uint id,
    string hash,
    string title,
    address author
  );

  constructor() public {
  }

  function uploadIdea(string memory _ideaHash, string memory _title) public {
    // Make sure the idea hash exists
    require(bytes(_ideaHash).length > 0);
    // Make sure idea title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment idea id
    ideaCount ++;

    // Add idea to the contract
    ideas[ideaCount] = Idea(ideaCount, _ideaHash, _title, msg.sender);
    // Trigger an event
    emit IdeaUploaded(ideaCount, _ideaHash, _title, msg.sender);
  }
}
