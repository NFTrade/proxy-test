pragma solidity ^0.8.4;

contract Test {

    struct TradeDetails {
        address _proxy;
        uint256 value;
        bytes tradeData;
    }

    function buy(bytes calldata bundle_) payable external {
        (address[] memory contracts_, uint256[] memory values_, bytes[] memory data_) = abi.decode(
            bundle_,
            (address[], uint256[], bytes[])
        );

        for (uint256 i = 0; i < contracts_.length; i++) {
            (bool success_, ) = payable(contracts_[i]).call{value: values_[i]}(data_[i]);

            require(success_, "BundleExecutorImplementation: call reverted");
        }
    }

    receive() external payable {}
}
