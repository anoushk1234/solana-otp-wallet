use std::mem::size_of;

use anchor_lang::prelude::*;
use shamir::SecretData;



#[account]
pub struct SafeAccount{
    pub share: [u8;32], // 128 bit -> 31 digits -> 32 array len
    pub bump: u8,
    pub owner: Pubkey,
    pub rand_hash: [u8;32],
    pub otp_authority: Pubkey
}

impl SafeAccount {
    pub const LEN: usize = 8 + size_of::<Self>();
    pub fn new(share: [u8;32], bump: u8, owner: Pubkey,rand_hash: [u8;32], otp_authority: Pubkey) -> Self{
        Self { share, bump, owner,rand_hash,otp_authority }
    }

    pub fn recover_secret(&self,share1:[u8;32],share2: [u8;32]) -> Option<u128>{
        let mut vec_share_1= share1.to_vec();
        let mut vec_share_2= share2.to_vec();
        msg!("len: {}",vec_share_1.len());
       vec_share_1= vec_share_1.into_iter().filter(|x| x != &0).collect();
       vec_share_2= vec_share_2.into_iter().filter(|x| x != &0).collect();
    //    share1[ min( which ( x != 0 )) : max( which( share1 != 0 )) ]
    
    msg!("a1: {:?} a2: {:?}",vec_share_1,vec_share_2);
        let recovered = SecretData::recover_secret(2, vec![vec_share_1,vec_share_2]);
        msg!("rec {:?}",recovered);
        match recovered {
            Some(s) => Some(s.parse::<u128>().unwrap()),
            None => None
        }
    }
}
