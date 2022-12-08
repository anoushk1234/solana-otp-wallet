# Solana-otp-wallet

## Problem
The problem with current hot wallets is that the user has to store a mnemonic somewhere and manage the key. 
This opens the possibility of losing private keys and hence users' funds with it. We introduce a simple wallet recovery mechanism 
using OTPs integrated into our smart contract wallet. 
The wallet is now not only recoverable but also seamless due to the use of user friendly OTP system.

## Implementation
The main challenge that we faced was to rely on a trusted and centralized OTP verifying service which opens up the possibility of censorship. Ideally we'd want this OTP verification to be done on the smart contract itself making it trustless.
Some possible solutions that could be used to address this issue:

   - Use of zk-proofs like Bulletproofs (a special optimized case of range-proofs) to prove that the OTP lies in a certain numeric range but without revealing it.

   - Using Shamir Secret sharing to split the OTP off-chain into 2 or more shares that can be recombined on chain to be verified. These shares would of course be homomorphically encrypted and verified using zk proofs.
    
We chose the second option for our v1.

# How it Works

<img width="1045" alt="Screenshot 2022-12-08 at 10 38 46 AM" src="https://user-images.githubusercontent.com/32778608/206385196-59d0be55-5106-465e-9b1c-7affa9273bc4.png">

<hr/>

# Credits: 
  - [@harsh4786](https://github.com/harsh4786) for contributing with the cryptography
  - [@abishekk92](https://github.com/abishekk92) for giving us the Idea
