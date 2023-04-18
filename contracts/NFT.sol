pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract NFT is ERC721Enumerable {

    uint256[] public tokens;
    uint256 public counter = 0; 

    constructor() ERC721("test", "test") {}
    
    function mint() public {
        counter+=1;
        _mint(msg.sender, counter);
    }
}