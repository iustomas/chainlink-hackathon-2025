// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockV3Aggregator is AggregatorV3Interface {
    uint256 private constant VERSION = 0;

    uint8   private decimals_;
    int256  private latestAnswer_;
    uint256 private latestTimestamp_;
    uint80  private latestRound_;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals_      = _decimals;
        latestAnswer_  = _initialAnswer;
        latestTimestamp_ = block.timestamp;
        latestRound_   = 1;
    }

    /* ════════════════════════  WRITERS (los que faltaban) ═════════════════════ */

    /// @notice actualiza sólo el answer y timestamp
    function updateAnswer(int256 _answer) external {
        latestAnswer_   = _answer;
        latestTimestamp_ = block.timestamp;
        latestRound_++;
    }

    /// @notice versión completa usada por algunos tests
    function updateRoundData(
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ) external {
        latestAnswer_   = _answer;
        latestTimestamp_ = _updatedAt;
        latestRound_    = _roundId;

        // los parámetros _startedAt y _answeredInRound
        // no los almacenamos porque no los usa el contrato,
        // pero así cumplimos con la firma exacta
    }

    /* ════════════════════════  READ-ONLY  ═════════════════════ */

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
            latestRound_,
            latestAnswer_,
            latestTimestamp_,
            latestTimestamp_,
            latestRound_
        );
    }
}
