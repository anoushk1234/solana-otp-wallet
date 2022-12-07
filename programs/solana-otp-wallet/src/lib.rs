use anchor_lang::prelude::*;

declare_id!("CXKwMk3xAPb36Rb34wAffLhoFkQayauSL5xGuMUaeGGR");
// pub mod 
pub mod instructions;
use instructions::*;

pub mod state;
use state::*;
#[program]
pub mod solana_otp_wallet {
    use super::*;

    pub fn initialize(ctx: Context<InitializeWallet>,   share: [u8;32],rand_hash: [u8;32],otp_authority: Pubkey) -> Result<()> {
        initialize_wallet::handler(ctx,share,rand_hash,otp_authority)?;
        Ok(())
    }
    pub fn recover_wallet(ctx: Context<RecoverWallet>, share: [u8;32],rand_hash: [u8;32]) -> Result<()>{
        recover_wallet::handler(ctx,share,rand_hash)?;
        Ok(())
    }
    pub fn withdraw_funds(ctx:Context<WithdrawFunds>,amt: u64)-> Result<()>{
        withdraw_funds::handler(ctx, amt)?;
        Ok(())
    }
    pub fn update_otp(ctx:Context<UpdateOTP>,random_variable: [u8;32])-> Result<()>{
        update_otp::handler(ctx, random_variable)?;
        Ok(())
    }
}


#[error_code]
pub enum CustomError{
    #[msg("You don't have authority of this safe")]
    UnauthorizedAccess,
    #[msg("You don't have enough funds in this safe")]
    InsufficientFunds,
    #[msg("Th authority passed isn't permitted to updated the otp share")]
    InvalidOTPAuthority
}