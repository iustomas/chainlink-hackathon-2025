import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("IntakePayment", (m) => {
  // For Base mainnet, we'll use the ETH/USD price feed
  const ethUsdPriceFeed = m.contract("IntakePayment", [
    "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70",
  ]);

  return {
    intakePayment: ethUsdPriceFeed,
  };
});
