import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Jupiter, TOKEN_LIST_URL } from '@jup-ag/core'
import fetch from "isomorphic-fetch";
import * as _ from 'lodash';
import bs58 from 'bs58'

const RPC_ENDPOINT = "https://cool-bitter-river.solana-mainnet.quiknode.pro/3a139f87ade69ba99a0db4ea3b720cdbab3c86e4/"
const quikNodeFrostRpc = 'https://frosty-red-morning.solana-mainnet.quiknode.pro'
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
const SOL_MINT_ADDRESS = "So11111111111111111111111111111111111111112"
const ENV = "mainnet-beta"

// Interface
export interface Token {
  chainId: number; // 101,
  address: string; // '8f9s1sUmzUbVZMoMh6bufMueYH1u4BJSM57RCEvuVmFp',
  symbol: string; // 'TRUE',
  name: string; // 'TrueSight',
  decimals: number; // 9,
  logoURI: string; // 'https://i.ibb.co/pKTWrwP/true.jpg',
  tags: string[]; // [ 'utility-token', 'capital-token' ]
}

const main = async () => {
  // Read secret key file to get owner keypair
  const secretKeyString = ENV;
  const secretKey = bs58.decode(secretKeyString);
  const owner = Keypair.fromSecretKey(secretKey);

  const connection = new Connection(quikNodeFrostRpc, 'processed'); 

  console.log(`Your wallet: ${owner.publicKey}`)
  const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();
  const jupiter = await Jupiter.load({
    connection,
    cluster: ENV,
    user: owner.publicKey, 
    //routeCacheDuration: -1, // Will not refetch data on computeRoutes for up to 5 seconds
  });

  let inputAmountUI = 100;
  const inputToken = _.find(tokens, (t) => t.address == USDC_MINT_ADDRESS)!; 
  const outputToken = _.find(tokens, (t) => t.address == SOL_MINT_ADDRESS)!; 
  console.error = function() {}

  while (true) {
		console.time("Elapsed")
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(inputToken.address), // Mint address of the input token
      outputMint: new PublicKey(outputToken.address), // Mint address of the output token
      inputAmount: 10000000, // raw input amount of tokens
      slippage: 0.4 // The slippage in % terms
      //forceFetch: true
    });
	
    let bestRoute = routes.routesInfos[0];
    let bestRoute2 = routes.routesInfos[1];
    let bestRoute3 = routes.routesInfos[2];
    let bestRoute4 = routes.routesInfos[3];
    let bestRoute5 = routes.routesInfos[4];
    
   console.log(`Quote: ${bestRoute.inAmount} USDC for ${bestRoute.outAmount} USDC via ${bestRoute.marketInfos[0].amm.label} | 2: ${bestRoute2.outAmount} | 3: ${bestRoute3.outAmount} | 4: ${bestRoute4.outAmount} | 5: ${bestRoute5.outAmount}`);
	
 /*const { transactions } = await jupiter.exchange({
        routeInfo: bestRoute,
      });
      const { setupTransaction, swapTransaction, cleanupTransaction } = transactions
      console.log(swapTransaction.instructions[0].keys)*/
  }

}

main()