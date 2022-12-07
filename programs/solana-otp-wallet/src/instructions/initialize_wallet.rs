use anchor_lang::prelude::*;
use crate::state::Safe::SafeAccount;

#[derive(Accounts)]
#[instruction(rand_hash: [u8;12])]
pub struct InitializeWallet<'info>{
    #[account(init,seeds=[b"safe_account",&rand_hash],bump,space=SafeAccount::LEN + 8,payer=authority)]
    pub safe_account: Account<'info,SafeAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info,System>
}

#[derive(AnchorSerialize,AnchorDeserialize)]
pub struct InitializeWalletParams{
    share: [u8;32],rand_hash: [u8;32]
}
pub fn handler(ctx:Context<InitializeWallet>, params:InitializeWalletParams) -> Result<()>{
    let InitializeWalletParams{share,rand_hash} = params;
    ctx.accounts.safe_account.bump = *ctx.bumps.get("safe_account").unwrap();
    ctx.accounts.safe_account.share = share;
    ctx.accounts.safe_account.owner = ctx.accounts.authority.key();
    ctx.accounts.safe_account.rand_hash = rand_hash;
    Ok(())
}