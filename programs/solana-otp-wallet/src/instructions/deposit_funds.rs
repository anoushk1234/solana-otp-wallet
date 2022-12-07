use anchor_lang::prelude::*;

use crate::{state::SafeAccount, CustomError};

#[derive(Accounts)]
#[instruction(rand_hash: [u8;32])]
pub struct DepositFunds<'info>{
    #[account(mut,seeds=[b"safe_account",&rand_hash],bump)]
    pub safe_account: Account<'info,SafeAccount>,

    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx:Context<DepositFunds>,amt: u64) -> Result<()>{
    require_eq!(ctx.accounts.safe_account.owner.key(), ctx.accounts.authority.key(), CustomError::UnauthorizedAccess);
    require_gt!(**ctx.accounts.authority.to_account_info().try_borrow_lamports()?,amt,CustomError::InsufficientFunds);

   let from_bal= ctx.accounts.authority.to_account_info().try_borrow_mut_lamports()?.checked_sub(amt);
   let safe_bal= ctx.accounts.safe_account.to_account_info().try_borrow_mut_lamports()?.checked_add(amt);

    msg!("Safe Balance:{} From Balance:{}",safe_bal.unwrap_or_default(),from_bal.unwrap_or_default());

    Ok(())
}