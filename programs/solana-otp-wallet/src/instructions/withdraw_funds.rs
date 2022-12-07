use anchor_lang::prelude::*;

use crate::{state::SafeAccount, CustomError};

#[derive(Accounts)]
#[instruction(rand_hash: [u8;32])]
pub struct WithdrawFunds<'info>{
    #[account(mut,seeds=[b"safe_account",&rand_hash],bump)]
    pub safe_account: Account<'info,SafeAccount>,

    ///CHECK: TO address for funds
    #[account(mut)]
    pub to: AccountInfo<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx:Context<WithdrawFunds>,amt: u64) -> Result<()>{
    require_eq!(ctx.accounts.safe_account.owner.key(), ctx.accounts.authority.key(), CustomError::UnauthorizedAccess);
    require_gt!(**ctx.accounts.safe_account.to_account_info().try_borrow_lamports()?,amt,CustomError::InsufficientFunds);

   let safe_bal= ctx.accounts.safe_account.to_account_info().try_borrow_mut_lamports()?.checked_sub(amt);
   let to_bal= ctx.accounts.to.to_account_info().try_borrow_mut_lamports()?.checked_add(amt);
   msg!("Safe Balance:{} To Balance:{}",safe_bal.unwrap_or_default(),to_bal.unwrap_or_default());
    Ok(())
}