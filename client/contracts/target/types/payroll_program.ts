/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/payroll_program.json`.
 */
export type PayrollProgram = {
  "address": "7LgKNYLik7m5XNsYa92u7MSvcnDmyxkAYJqAFdRmbqGS",
  "metadata": {
    "name": "payrollProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addWorker",
      "discriminator": [
        98,
        14,
        6,
        165,
        247,
        124,
        162,
        72
      ],
      "accounts": [
        {
          "name": "org",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "org.name",
                "account": "organization"
              }
            ]
          }
        },
        {
          "name": "worker",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  111,
                  114,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "org"
              },
              {
                "kind": "account",
                "path": "workerPubkey"
              }
            ]
          }
        },
        {
          "name": "workerPubkey"
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "org"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "salary",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createOrg",
      "discriminator": [
        48,
        115,
        187,
        249,
        36,
        3,
        186,
        175
      ],
      "accounts": [
        {
          "name": "org",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "fundTreasury",
      "discriminator": [
        71,
        154,
        45,
        220,
        206,
        32,
        174,
        239
      ],
      "accounts": [
        {
          "name": "org",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "org.name",
                "account": "organization"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "org"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "processPayroll",
      "discriminator": [
        46,
        67,
        49,
        7,
        159,
        125,
        165,
        172
      ],
      "accounts": [
        {
          "name": "org",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "org.name",
                "account": "organization"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "org"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "cycleTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "org",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "org.name",
                "account": "organization"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "org"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "organization",
      "discriminator": [
        145,
        38,
        152,
        251,
        91,
        57,
        118,
        160
      ]
    },
    {
      "name": "worker",
      "discriminator": [
        224,
        158,
        97,
        5,
        224,
        241,
        67,
        146
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "invalidName",
      "msg": "Invalid organization name length"
    },
    {
      "code": 6002,
      "name": "invalidSalary",
      "msg": "Invalid salary amount"
    },
    {
      "code": 6003,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6004,
      "name": "insufficientFunds",
      "msg": "Insufficient funds in treasury"
    },
    {
      "code": 6005,
      "name": "missingWorkerAccount",
      "msg": "Missing worker account in remaining accounts"
    },
    {
      "code": 6006,
      "name": "invalidWorkerPda",
      "msg": "Invalid worker PDA"
    },
    {
      "code": 6007,
      "name": "invalidWorkerWallet",
      "msg": "Invalid worker wallet pubkey"
    }
  ],
  "types": [
    {
      "name": "organization",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "treasury",
            "type": "u64"
          },
          {
            "name": "workersCount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "worker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "org",
            "type": "pubkey"
          },
          {
            "name": "workerPubkey",
            "type": "pubkey"
          },
          {
            "name": "salary",
            "type": "u64"
          },
          {
            "name": "lastPaidCycle",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
