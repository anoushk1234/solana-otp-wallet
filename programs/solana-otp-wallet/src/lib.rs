use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
// pub mod 
pub mod instructions;
use instructions::*;
#[program]
pub mod solana_otp_wallet {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {

        Ok(())
    }
}


