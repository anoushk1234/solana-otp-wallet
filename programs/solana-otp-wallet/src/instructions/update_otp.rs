use anchor_lang::prelude::*;

use crate::{state::SafeAccount, CustomError};

#[derive(Accounts)]
#[instruction(random_variable: [u8;32])]
pub struct UpdateOTP<'info>{
    #[account(mut,seeds=[b"safe_account",&safe_account.rand_hash],bump)]
    pub safe_account: Account<'info,SafeAccount>,

    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx:Context<UpdateOTP>,random_variable: [u8;32]) -> Result<()>{
    // require_eq!(ctx.accounts.safe_account.owner.key(), ctx.accounts.authority.key(), CustomError::UnauthorizedAccess);
    require_eq!(ctx.accounts.authority.key(),ctx.accounts.safe_account.otp_authority.key(),CustomError::InvalidOTPAuthority);
    ctx.accounts.safe_account.share = random_variable;
    msg!("Share updated");

    Ok(())
}