import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaOtpWallet } from "../target/types/solana_otp_wallet";

describe("solana-otp-wallet", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaOtpWallet as Program<SolanaOtpWallet>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
