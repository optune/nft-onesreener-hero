// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC721Payable.sol";

/// @custom:security-contact joel@oscillate.ch
contract OnescreenerHeroToken is Ownable, ERC721Payable {
    using Counters for Counters.Counter;

    event NewToken(uint256 tokenId, string domain);
    event ReclaimToken(
        address indexed from,
        address indexed to,
        uint256 tokenId
    );
    event Price(uint256 tokenId, uint256 price);
    event ValuePaid(uint256 value, uint256 price);

    uint256 initialFee = 0.001 ether;
    uint256 maxTokenCount = 100;
    uint256 validityTimespan = 7 days;

    struct OnescreenerHero {
        string domain;
        uint8 transferCount;
        uint32 validUntil;
    }

    Counters.Counter private _tokenIdCounter;
    OnescreenerHero[] private _tokens;

    mapping(uint256 => address) public tokenToOwner;

    constructor() ERC721Payable("OnescreenerHeroToken", "OHT") {}

    modifier onlyOwnerOf(uint256 tokenId) {
        require(_msgSender() == ownerOf(tokenId));
        _;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://hero.onescreener.com";
    }

    // function safeMint(address to) public onlyOwner {
    //     _safeMint(to, _tokenIdCounter.current());
    //     _tokenIdCounter.increment();
    // }

    // Only contract owner can create new token and link it to a onescreener
    function mint(string calldata domain) public onlyOwner {
        require(_tokenIdCounter.current() < maxTokenCount, "Maximum of 100 tokens reached");
        
        (bool exists, uint256 existingTokenId) = getTokenOfDomain(domain);

        require(!exists, "Domain exists already");

        uint32 validUntil = uint32(block.timestamp + validityTimespan);
        _tokens.push(OnescreenerHero(domain, 0, validUntil));
        uint256 tokenId = _tokens.length - 1;

        _safeMint(_msgSender(), tokenId);
        _tokenIdCounter.increment();

        emit NewToken(tokenId, domain);
    }

    function _getPrice(uint256 tokenId) internal view returns (uint256) {
        uint256 price = (_tokens[tokenId].transferCount) * (1 ether);
        uint256 fee = initialFee + price;

        return fee;
    }

    // The owner needs to approve the transfer of the OHT token first
    // Once approved, the new owner can claim the OHT token
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        require(
            msg.value >= _getPrice(tokenId),
            "ERC721Payable: the provided value is lower than the price "
        );
        require(
            getApproved(tokenId) == _msgSender(),
            "ERC721: transfer caller is not approved"
        );

        _transfer(from, to, tokenId);
        _tokens[tokenId].transferCount += 1;
    }

    // Re-claim approved token
    function reclaim(address to, uint256 tokenId)
        external
        payable
        onlyOwnerOf(tokenId)
    {
        require(getApproved(tokenId) == to);

        approve(address(0), tokenId);

        emit ReclaimToken(_msgSender(), to, tokenId);
    }

    function getTokens() external view returns (OnescreenerHero[] memory) {
        return _tokens;
    }

    function getTokensByOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory result = new uint256[](balanceOf(_owner));
        uint256 counter = 0;
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (ownerOf(i) == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getApprovedTokenForOwner(address owner)
        external
        view
        returns (uint256)
    {
        uint256 tokenId = 9999;

        for (uint256 id = 0; id < _tokenIdCounter.current(); id++) {
            if (_tokenApprovals[id] == owner) {
                tokenId = id;
            }
        }
        return tokenId;
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    // Domain functions
    function getTokenOfDomain(string memory domain)
        public
        view
        returns (bool exists, uint256 tokenId)
    {        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            OnescreenerHero storage token = _tokens[i];
            if (compareStrings(domain, token.domain)) {
                return (true, i);
            }
        }
        return (false, 0);
    }

    function changeDomain(uint256 tokenId, string calldata domain)
        external
        onlyOwnerOf(tokenId)
    {
        _tokens[tokenId].domain = domain;
    }
}
