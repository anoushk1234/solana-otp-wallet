use anchor_lang::prelude::*;
use crate::state::Safe::SafeAccount;
use std::mem;
#[derive(Accounts)]
#[instruction(share: [u8;32],rand_hash: [u8;32])]
pub struct InitializeWallet<'info>{
    #[account(init,seeds=[b"safe_account".as_ref(),&rand_hash],bump,space=SafeAccount::LEN,payer=authority)]
    pub safe_account: Account<'info,SafeAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info,System>
}


pub fn handler(ctx:Context<InitializeWallet>, share: [u8;32],rand_hash: [u8;32],otp_authority: Pubkey) -> Result<()>{

    ctx.accounts.safe_account.bump = *ctx.bumps.get("safe_account").unwrap();
    ctx.accounts.safe_account.share = share;
    ctx.accounts.safe_account.owner = ctx.accounts.authority.key();
    ctx.accounts.safe_account.rand_hash = rand_hash;
    ctx.accounts.safe_account.otp_authority = otp_authority;
    Ok(())
}