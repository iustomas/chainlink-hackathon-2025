import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("ConsumerSimpleImproved2", (m) => {
  // For BASE mainnet
  const ROUTER_BASE_MAINNET = "0xf9b8fc078197181c841c296c876945aaa425b278";
  const DON_ID_BASE_MAINNET =
    "0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000";
  const SUBSCRIPTION_ID = 60n; // 👈 tu Subscription ID
  const GAS_LIMIT = 200_000; // uint32

  const consumer = m.contract("ConsumerSimpleImproved2", [
    ROUTER_BASE_MAINNET,
    DON_ID_BASE_MAINNET,
    SUBSCRIPTION_ID,
    GAS_LIMIT,
  ]);

  return { consumer };
});
