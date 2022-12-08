import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaOtpWallet } from "../target/types/solana_otp_wallet";
import { airdrop, genCode, getBalance, trueTypeOf } from "./helpers";
// import sss from "shamirs-secret-sharing";
import randombytes from "randombytes";
import { expect } from "chai";
import { randomBytes } from "crypto";
import { get_share, with_secret } from "./shamir-client";
// import { split, join } from "shamir";
// import ffi from "ffi";
// import path from "path";
describe("solana-otp-wallet", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaOtpWallet as Program<SolanaOtpWallet>;
  const initialAuthority = anchor.web3.Keypair.generate();
  const initialAuthorityPubkey = initialAuthority.publicKey;
  const newAuthority = anchor.web3.Keypair.generate();
  const newAuthorityPubkey = newAuthority.publicKey;
  const secret = randombytes(32);
  let safeAccount: anchor.web3.PublicKey;
  const otp_authority = anchor.web3.Keypair.generate();
  let share1: number[] = [];
  let share2: number[] = [];
  before(async () => {
    await airdrop(initialAuthorityPubkey);
    await airdrop(newAuthorityPubkey);
  });

  it("Is initialized!", async () => {
    let randomHash = randombytes(32);
    const seeds = [anchor.utils.bytes.utf8.encode("safe_account"), randomHash];
    const [safe, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );
    safeAccount = safe;
    console.table({
      initialAuthority: initialAuthorityPubkey.toBase58(),
      newAuthority: newAuthorityPubkey.toBase58(),
      safe: safe.toBase58(),
      bump,
    });
    const otp = genCode(secret.toString("utf-8")).toString();
    // const shares = sss.split(Buffer.from(otp), {
    //   shares: 2,
    //   threshold: 2,
    // }) as Buffer[];
    // console.log("Shares 1", Array.from(shares[0]));

    // const utf8Encoder = new TextEncoder();
    // const secretBytes = utf8Encoder.encode(otp);
    // parts is a map of part numbers to Uint8Array
    // const shares = sharing_lib.shamirsharing(otp);
    let share_data = with_secret(otp, 2);
    let s1 = get_share(share_data, 1);
    let s2 = get_share(share_data, 2);
    if (trueTypeOf(share2) !== "array") throw new Error(share2.toString());
    share2 = s2 as number[];
    if (trueTypeOf(share1) !== "array") throw new Error(share1.toString());
    share1 = s1 as number[];
    console.table({
      otp,
      share1,
      share2,
    });
    const tx = await program.methods
      .initialize(
        Array.from(share2 as number[]),
        Array.from(randomHash),
        otp_authority.publicKey
      )
      .accounts({
        safeAccount: safe,
        authority: initialAuthorityPubkey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initialAuthority])
      // .transaction();
      .rpc();
    console.log(
      "Your transaction",
      `https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
    );
  });
  it("should deposit", async () => {
    const depositor = anchor.web3.Keypair.generate();
    const depositorPubkey = depositor.publicKey;
    await airdrop(depositorPubkey);
    const amount = new anchor.BN(6.9 * LAMPORTS_PER_SOL);
    const depositorBalance = await getBalance(depositorPubkey);
    const transferTransaction = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: depositorPubkey,
        toPubkey: safeAccount,
        lamports: amount.toNumber(),
      })
    );

    const tx = await anchor.web3.sendAndConfirmTransaction(
      program.provider.connection,
      transferTransaction,
      [depositor]
    );

    console.log(
      "Your transaction",
      `https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
    );
    const safeBalance = await getBalance(safeAccount);

    console.log("safeBalance", safeBalance);
    // expect(safeBalance).to.be.eq(amount.toNumber() + 1677360);
    // expect(await getBalance(depositorPubkey)).to.be.eq(
    //   depositorBalance - amount.toNumber()
    // );
  });
  it("should update otp", async () => {
    try {
      await airdrop(otp_authority.publicKey);
      const otp = genCode(secret.toString("utf-8")).toString();
      let share_data = with_secret(otp, 2);
      let s1 = get_share(share_data, 1);
      let s2 = get_share(share_data, 2);

      if (trueTypeOf(share2) !== "array") throw new Error(share2.toString());
      share2 = s2 as number[];
      if (trueTypeOf(share1) !== "array") throw new Error(share1.toString());
      share1 = s1 as number[];
      console.table({
        otp,
        share1,
        share2,
      });

      let arr = share2 as number[];
      if (arr.length < 32) {
        arr = arr.concat(Array(32 - arr.length).fill(0));
      }
      const tx = await program.methods
        .updateOtp(arr)
        .accounts({
          safeAccount: safeAccount,
          authority: otp_authority.publicKey,
        })
        .signers([otp_authority])
        .rpc({
          skipPreflight: true,
        });
      console.log(
        "Your transaction",
        `https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
      );
    } catch (error) {
      console.log(error);
    }
  });
  it("should recover", async () => {
    await airdrop(newAuthorityPubkey);
    const otp = genCode(secret.toString("utf-8")).toString();
    // let share_data = with_secret(otp, 2);
    // let share1 = get_share(share_data, 1);
    // let share2 = get_share(share_data, 2);

    console.log({
      otp,
      share1,
      share2,
    });
    // if (trueTypeOf(share1) !== "array") throw new Error(share1.toString());
    console.log("Shares1 recover", share1 as number[]);
    let arr = share1 as number[];
    if (arr.length < 32) {
      arr = arr.concat(Array(32 - arr.length).fill(0));
    }
    const tx = await program.methods
      .recoverWallet(arr)
      .accounts({
        safeAccount: safeAccount,
        authority: newAuthorityPubkey,
      })
      .signers([newAuthority])
      .rpc({
        skipPreflight: true,
      });
    console.log(
      "Your transaction",
      `https://explorer.solana.com/tx/${tx}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
    );
    let safeAccountInfo = await program.account.safeAccount.fetch(safeAccount);
    console.table({
      owner: safeAccountInfo.owner.toBase58(),
      initialAuthority: initialAuthorityPubkey.toBase58(),
      newAuthority: newAuthorityPubkey.toBase58(),
      safe: safeAccount.toBase58(),
    });
  });
});

// describe("SafeAccount", () => {
//   var sharing_lib = ffi.Library(
//     path.join(__dirname, "../target/release/libembed"),
//     {
//       shamirsharing: ["string", ["string"]],
//     }
//   );
//   const otp = genCode("klnsnlknn").toString();
//   // const shares = sss.split(Buffer.from(otp), {
//   //   shares: 2,
//   //   threshold: 2,
//   // }) as Buffer[];
//   // console.log("Shares 1", Array.from(shares[0]));

//   // const utf8Encoder = new TextEncoder();
//   // const secretBytes = utf8Encoder.encode(otp);
//   // parts is a map of part numbers to Uint8Array
//   const shares = sharing_lib.shamirsharing(otp);
//   console.log("Shares 1", shares);
// });
