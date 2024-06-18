import { config } from "dotenv";
import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { watchContractEvents } from "thirdweb";
import { tokensClaimedEvent } from "thirdweb/extensions/erc1155";
config();

const main = async () => {
  const client = createThirdwebClient({
    secretKey: process.env.THIRDWEB_SECRET_KEY as string,
  });
  const contract = getContract({
    address: "0xEa8D19fA18Fd04B33DA9cDf62A85846A50E08E82",
    chain: sepolia,
    client,
  });

  /**
   * Listen to the claim event of the Edition Drop contract
   * To test it, run "npm start" then head over to this page and claim an NFT:
   * https://thirdweb.com/sepolia/0xEa8D19fA18Fd04B33DA9cDf62A85846A50E08E82/nfts/0
   * 
   * Check the terminal for the logs
   */
  watchContractEvents({
    contract,
    events: [tokensClaimedEvent()],
    onEvents: (events) => {
      events.forEach((event) => {
        const quantityClaimed = event.args.quantityClaimed.toString();
        const { claimer, receiver } = event.args;
        console.log(
          `${quantityClaimed} tokens has been claimed by wallet: [${claimer}] to destination: [${receiver}]`
        );
      });
    },
  });
};

main();

// const example_of_events = [
//   {
//     eventName: "TokensClaimed",
//     args: {
//       claimConditionIndex: 0n,
//       claimer: "0x3dDe4b49dCFD8f14524B8Cb439703d024a5C4A1b",
//       receiver: "0x3dDe4b49dCFD8f14524B8Cb439703d024a5C4A1b",
//       tokenId: 0n,
//       quantityClaimed: 1n,
//     },
//     address: "0xea8d19fa18fd04b33da9cdf62a85846a50e08e82",
//     topics: [
//       "0xfa76a4010d9533e3e964f2930a65fb6042a12fa6ff5b08281837a10b0be7321e",
//       "0x0000000000000000000000000000000000000000000000000000000000000000",
//       "0x0000000000000000000000003dde4b49dcfd8f14524b8cb439703d024a5c4a1b",
//       "0x0000000000000000000000003dde4b49dcfd8f14524b8cb439703d024a5c4a1b",
//     ],
//     data: "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001",
//     blockNumber: 6130582n,
//     transactionHash:
//       "0xb464e8b3071f481893f076da6d4c58d08b9e4dd149b2bc4d67db46d44272732c",
//     transactionIndex: 66,
//     blockHash:
//       "0x0c001ea82f0d06aa687563d29a2263294e241530bce0fddfcb8a12ae39e7fc09",
//     logIndex: 99,
//     removed: false,
//   },
// ];
