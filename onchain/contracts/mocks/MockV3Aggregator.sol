// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MockV3Aggregator is AggregatorV3Interface {
    uint256 private constant VERSION = 0;
    uint8 private decimals_;
    int256 private latestAnswer_;
    uint256 private latestTimestamp_;
    uint256 private latestRound_;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals_ = _decimals;
        latestAnswer_ = _initialAnswer;
        latestTimestamp_ = block.timestamp;
        latestRound_ = 1;
    }

    function decimals() external view override returns (uint8) {
        return decimals_;
    }

    function description() external pure override returns (string memory) {
        return "Mock V3 Aggregator";
    }

    function version() external pure override returns (uint256) {
        return VERSION;
    }

    function getRoundData(uint80 _roundId)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            _roundId,
            latestAnswer_,
            latestTimestamp_,
            latestTimestamp_,
            _roundId
        );
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            uint80(latestRound_),
            latestAnswer_,
            latestTimestamp_,
            latestTimestamp_,
            uint80(latestRound_)
        );
    }
} 