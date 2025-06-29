import { buildModule } from "@nomicfoundation/ignition-core";

export default buildModule("PayProposal", (m) => {
  /* ─────────────── Chainlink Price Feed (Base mainnet) ─────────────── */
  const ETH_USD_PRICE_FEED_BASE_MAINNET =
    "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70";

  /* ─────────────── Chainlink VRF v2.5 (Base mainnet) ─────────────── */
  const VRF_COORDINATOR_BASE_MAINNET =
    "0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634";
  const VRF_KEY_HASH_2_GWEI =
    "0x00b81b5a830cb0a4009fbd8904de511e28631e62ce5ad231373d3cdad373ccab";
  const VRF_SUBSCRIPTION_ID = BigInt(
    "102282035841499285745888608454266153999213776268843959916517149319754593222582"
  );

  /* ─────────────── Chainlink Functions (Base mainnet) ─────────────── */
  const FUNCTIONS_ROUTER_BASE_MAINNET =
    "0xf9b8fc078197181c841c296c876945aaa425b278";
  const DON_ID_BASE_MAINNET =
    "0x66756e2d626173652d6d61696e6e65742d310000000000000000000000000000";

  const FUNCTIONS_SUBSCRIPTION_ID = 60n;
  const FUNCTIONS_GAS_LIMIT = 200_000;

  /* ─────────────── DON-hosted secrets ─────────────── */
  const SECRETS_SLOT = 0;
  const SECRETS_VERSION = 1750719836;

  /* ─────────────── Already deployed TomasSubscription ─────────────── */
  const TOMAS_SUBSCRIPTION_ADDRESS =
    "0xD7c4216Fd15706927520D3870e6C7eAE2aA30d99";

  const TOMAS_ADDRESS = "0x93C2F31E0F48dbBa50c98eDd59511b6cd2B149Cf";

  /* ─────────────── Deploy PayProposal ─────────────── */
  const payProposal = m.contract(
    "TomasPayProposal",
    [
      // owner
      TOMAS_ADDRESS,

      // oracle & subs
      ETH_USD_PRICE_FEED_BASE_MAINNET,
      TOMAS_SUBSCRIPTION_ADDRESS,

      // VRF
      VRF_COORDINATOR_BASE_MAINNET,
      VRF_KEY_HASH_2_GWEI,
      VRF_SUBSCRIPTION_ID,

      // Functions
      FUNCTIONS_ROUTER_BASE_MAINNET,
      DON_ID_BASE_MAINNET,
      FUNCTIONS_SUBSCRIPTION_ID,
      FUNCTIONS_GAS_LIMIT,
      SECRETS_SLOT,
      SECRETS_VERSION,
    ],
    { id: "TomasPayProposalV2" }
  );

  return { payProposal };
});
