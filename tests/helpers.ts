import * as anchor from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import base32 from "base32.js";

import { HmacSHA1 } from "crypto-js";
const provider = anchor.getProvider();

export async function airdrop(key: PublicKey) {
  const airdropSig = await provider.connection.requestAirdrop(
    key,
    10 * LAMPORTS_PER_SOL
  );
  return provider.connection.confirmTransaction(airdropSig);
}

export async function getBalance(key: PublicKey) {
  console.log(provider.connection.rpcEndpoint);
  return await provider.connection.getBalance(key);
}

export function genCode(seed: string) {
  const time = Date.now();

  const message = Math.floor(time / 30000);

  let decoder = new base32.Encoder({ type: "crockford", lc: true });

  const hash = HmacSHA1(message.toString(), decoder.write(seed).finalize());

  const code = hash.words[0] & 0x7fffffff;

  return code % 1000000;
}

export const trueTypeOf = (obj: any) =>
  Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
