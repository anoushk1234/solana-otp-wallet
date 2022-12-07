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

    pub fn initialize(ctx: Context<InitializeWallet>, params: InitializeWalletParams) -> Result<()> {
        initialize_wallet::handler(ctx,params)?;
        Ok(())
    }
    pub fn recover_wallet(ctx: Context<RecoverWallet>,params: RecoverWalletParams) -> Result<()>{
        recover_wallet::handler(ctx,params)?;
        Ok(())
    }
    pub fn withdraw_funds(ctx:Context<WithdrawFunds>,amt: u64)-> Result<()>{
        withdraw_funds::handler(ctx, amt)?;
        Ok(())
    }
    pub fn deposit_funds(ctx:Context<DepositFunds>,amt: u64)-> Result<()>{
        deposit_funds::handler(ctx, amt)?;
        Ok(())
    }
}


#[error_code]
pub enum CustomError{
    #[msg("You don't have authority of this safe")]
    UnauthorizedAccess,
    #[msg("You don't have enough funds in this safe")]
    InsufficientFunds
}