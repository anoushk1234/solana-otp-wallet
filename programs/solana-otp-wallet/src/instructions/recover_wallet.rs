use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Initialize<'info>{

    pub authority: Signer<'info>
}
pub fn handler(ctx:Context<Initialize>) -> Result<()>{
    Ok(())
}