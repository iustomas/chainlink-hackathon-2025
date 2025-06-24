import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("ConsumerSimpleWithVRF6", (m) => {
  /* ─────────────── Chainlink Functions (Base mainnet) ─────────────── */
  const FUNCTIONS_ROUTER_BASE_MAINNET =
    "0xf9b8fc078197181c841c296c876945aaa425b278";
  const DON_ID_BASE_MAINNET =
    "0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000";

  const FUNCTIONS_SUBSCRIPTION_ID = 60n;
  const FUNCTIONS_GAS_LIMIT = 200_000;

  /* ─────────────── Chainlink VRF v2 (Base mainnet) ─────────────── */
  const VRF_COORDINATOR_BASE_MAINNET =
    "0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634";
  const VRF_KEY_HASH_2_GWEI =
    "0x00b81b5a830cb0a4009fbd8904de511e28631e62ce5ad231373d3cdad373ccab";
  const VRF_SUBSCRIPTION_ID = BigInt(
    "102282035841499285745888608454266153999213776268843959916517149319754593222582"
  );

  /* ─────────────── DON-hosted secrets ─────────────── */
  const SECRETS_SLOT = 0;
  const SECRETS_VERSION = 1750719836;

  /* ─────────────── Deploy ─────────────── */
  const consumer = m.contract("ConsumerSimpleWithVRF6", [
    FUNCTIONS_ROUTER_BASE_MAINNET,
    DON_ID_BASE_MAINNET,
    FUNCTIONS_SUBSCRIPTION_ID,
    FUNCTIONS_GAS_LIMIT,
    VRF_COORDINATOR_BASE_MAINNET,
    VRF_KEY_HASH_2_GWEI,
    VRF_SUBSCRIPTION_ID,
    SECRETS_SLOT,
    SECRETS_VERSION,
  ]);

  return { consumer };
});
