import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("TomasSubscription", (m) => {
  /* ─────────────── Chainlink Price Feed (Base mainnet) ─────────────── */
  const ETH_USD_PRICE_FEED_BASE_MAINNET =
    "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70";

  /* ─────────────── Deploy ─────────────── */
  const subscription = m.contract("TomasSubscription", [
    ETH_USD_PRICE_FEED_BASE_MAINNET,
  ]);

  return { subscription };
});
