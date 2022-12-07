use anchor_lang::prelude::*;

use crate::state::SafeAccount;

#[derive(Accounts)]
// #[instruction( share: [u8;32],rand_hash: [u8;32])]
pub struct RecoverWallet<'info>{
    #[account(mut,seeds=[b"safe_account".as_ref(),&safe_account.rand_hash],bump)]
    pub safe_account: Account<'info,SafeAccount>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(AnchorSerialize,AnchorDeserialize)]
pub struct RecoverWalletParams{
   
}
pub fn handler(ctx:Context<RecoverWallet>, share: [u8;32],rand_hash: [u8;32]) -> Result<()>{
    let old_owner= ctx.accounts.authority.key();
        let safe = SafeAccount::new(share, ctx.accounts.safe_account.bump, old_owner, rand_hash);
        let recovered_secret = safe.recover_secret(share);
        match recovered_secret{
            Some(secret_otp) => {
                ctx.accounts.safe_account.owner = ctx.accounts.authority.key()
            },
            None => panic!("Unable to recover OTP")
        }
    Ok(())
}