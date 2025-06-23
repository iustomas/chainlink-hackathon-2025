import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("ConsumerSimple", (m) => {
  // For BASE mainnet
  const ROUTER_BASE_MAINNET = "0xf9B8fc078197181C841c296C876945aaa425B278";
  const DON_ID_BASE_MAINNET =
    "0x66756e2d626173652d6d61696e6e65742d3100000000000000000000000000";
  const SUBSCRIPTION_ID = 60n; // 👈 tu Subscription ID
  const GAS_LIMIT = 300_000; // uint32

  const consumer = m.contract("ConsumerSimple", [
    ROUTER_BASE_MAINNET,
    DON_ID_BASE_MAINNET,
    SUBSCRIPTION_ID,
    GAS_LIMIT,
  ]);

  return { consumer };
});
