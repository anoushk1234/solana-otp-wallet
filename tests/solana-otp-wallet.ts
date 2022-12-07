import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaOtpWallet } from "../target/types/solana_otp_wallet";
import { airdrop, genCode, getBalance } from "./helpers";
import sss from "shamirs-secret-sharing";
import randomBytes from "randombytes";
import { expect } from "chai";

describe("solana-otp-wallet", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaOtpWallet as Program<SolanaOtpWallet>;
  const initialAuthority = anchor.web3.Keypair.generate();
  const initialAuthorityPubkey = initialAuthority.publicKey;
  const newAuthority = anchor.web3.Keypair.generate();
  const newAuthorityPubkey = newAuthority.publicKey;
  const secret = randomBytes(32);
  let safeAccount: anchor.web3.PublicKey;
  before(async () => {
    await airdrop(initialAuthorityPubkey);
    await airdrop(newAuthorityPubkey);
  });
  it("Is initialized!", async () => {
    let randomHash = randomBytes(32);
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
    const shares = sss.split(Buffer.from(otp), {
      shares: 2,
      threshold: 2,
    }) as Buffer[];
    console.log("Shares", Array.from(shares[0]));
    const tx = await program.methods
      .initialize(Array.from(shares[1]), randomHash as any)
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
    expect(safeBalance).to.be.eq(amount.toNumber() + 1677360);
    // expect(await getBalance(depositorPubkey)).to.be.eq(
    //   depositorBalance - amount.toNumber()
    // );
  });
});
