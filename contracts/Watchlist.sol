pragma solidity ^0.5.0;

contract Watchlist {
    uint public listCount = 0;


    struct Stock {
        uint id;
        string ticker;
        bool active;
    }

    mapping(uint => Stock) public stocks;

    // init that runs on deployment
    constructor() public {
        addStock("TSLA"); // Adding sample data to the watchlist
    }


    function addStock(string memory _content) public {
        listCount ++;
        stocks[listCount] = Stock(listCount, _content, true);
    }

}

//flow --> truffle compile --> truffle migrate --> 