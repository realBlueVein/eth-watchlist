pragma solidity ^0.5.0;

contract Watchlist {
    uint public listCount = 0;


    struct Stock {
        uint id;
        string ticker;
        bool active;
    }

    mapping(uint => Stock) public stocks;

    event StockCreated(
        uint id,
        string content,
        bool completed
    );

    event StockCompleted(
        uint id,
        bool active
    );


    // init that runs on deployment
    constructor() public {
        addStock("TSLA"); // Adding sample data to the watchlist
    }


    function addStock(string memory _content) public {
        listCount ++;
        stocks[listCount] = Stock(listCount, _content, true);
        emit StockCreated(listCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Stock memory _stock = stocks[_id];
        _stock.active = !_stock.active;
        stocks[_id] = _stock;
        emit StockCompleted(_id, _stock.active);
  }

}

//flow --> truffle compile --> truffle migrate --> 