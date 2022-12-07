export type SolanaOtpWallet = {
  "version": "0.1.0",
  "name": "solana_otp_wallet",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "randHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "otpAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "recoverWallet",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "share",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "randHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "withdrawFunds",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateOtp",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "randomVariable",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "safeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "share",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "randHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "otpAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RecoverWalletParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedAccess",
      "msg": "You don't have authority of this safe"
    },
    {
      "code": 6001,
      "name": "InsufficientFunds",
      "msg": "You don't have enough funds in this safe"
    },
    {
      "code": 6002,
      "name": "InvalidOTPAuthority",
      "msg": "Th authority passed isn't permitted to updated the otp share"
    }
  ]
};

export const IDL: SolanaOtpWallet = {
  "version": "0.1.0",
  "name": "solana_otp_wallet",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "share",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "randHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "otpAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "recoverWallet",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "share",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "randHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "withdrawFunds",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "to",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amt",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateOtp",
      "accounts": [
        {
          "name": "safeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "randomVariable",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "safeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "share",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "randHash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "otpAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RecoverWalletParams",
      "type": {
        "kind": "struct",
        "fields": []
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedAccess",
      "msg": "You don't have authority of this safe"
    },
    {
      "code": 6001,
      "name": "InsufficientFunds",
      "msg": "You don't have enough funds in this safe"
    },
    {
      "code": 6002,
      "name": "InvalidOTPAuthority",
      "msg": "Th authority passed isn't permitted to updated the otp share"
    }
  ]
};
