use anchor_lang::prelude::*;

use crate::{state::SafeAccount, CustomError};

#[derive(Accounts)]
// #[instruction(amt: u64,rand_hash: [u8;32])]
pub struct DepositFunds<'info>{
    #[account(mut,seeds=[b"safe_account",&safe_account.rand_hash],bump)]
    pub safe_account: Account<'info,SafeAccount>,

    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn handler(ctx:Context<DepositFunds>,amt: u64) -> Result<()>{
    // require_eq!(ctx.accounts.safe_account.owner.key(), ctx.accounts.authority.key(), CustomError::UnauthorizedAccess);
    require_gt!(**ctx.accounts.authority.to_account_info().try_borrow_lamports()?,amt,CustomError::InsufficientFunds);
    msg!("Before Safe Balance:{} From Balance:{}",ctx.accounts.safe_account.to_account_info().try_borrow_lamports()?,ctx.accounts.authority.to_account_info().try_borrow_lamports()?);
    let ix = anchor_lang::solana_program::system_instruction::transfer(
        &ctx.accounts.authority.key(),
        &ctx.accounts.safe_account.key(),
        amt,
    );
    let bump_sol_vector=ctx.accounts.safe_account.bump.to_le_bytes();
    let binding = ctx.accounts.authority.key();
    let inner=vec![binding.as_ref(),bump_sol_vector.as_ref()];
    let outer_sol=vec![inner.as_slice()];
    anchor_lang::solana_program::program::invoke_signed(
        &ix,
        &[
            ctx.accounts.authority.to_account_info(),
            ctx.accounts.safe_account.to_account_info(),
        ],outer_sol.as_slice())?;
    

    msg!("Safe Balance:{} From Balance:{}",ctx.accounts.safe_account.to_account_info().try_borrow_lamports()?,ctx.accounts.authority.to_account_info().try_borrow_lamports()?);

    Ok(())
}