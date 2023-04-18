pragma solidity ^0.8.4;

contract Test {

    struct TradeDetails {
        address _proxy;
        uint256 value;
        bytes tradeData;
    }

    function buy(TradeDetails calldata tradeDetails) payable external {
        (bool success, ) = payable(tradeDetails._proxy).call{value: tradeDetails.value}(
            tradeDetails.tradeData
        );
        require(success, "Test: Trade failed");
    }

    receive() external payable {}
}
