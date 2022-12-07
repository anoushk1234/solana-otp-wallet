use anchor_lang::prelude::*;
use shamir::SecretData;


#[account]
pub struct SafeAccount{
    pub share: [u8;32], // 128 bit -> 31 digits -> 32 array len
    pub bump: u8,
    pub owner: Pubkey,
    pub rand_hash: [u8;32]
}

impl SafeAccount {
    pub const LEN: usize = 7 + 2 + 32 + 32;
    pub fn new(share: [u8;32], bump: u8, owner: Pubkey,rand_hash: [u8;32]) -> Self{
        Self { share, bump, owner,rand_hash }
    }

    pub fn recover_secret(&self,share1:[u8;32]) -> Option<u128>{
        let recovered = SecretData::recover_secret(2, vec![share1.to_vec(), self.share.to_vec() ]);
        match recovered {
            Some(s) => Some(s.parse::<u128>().unwrap()),
            None => None
        }
    }
}