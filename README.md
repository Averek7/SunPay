# 🌞 SunPay — Decentralized Payroll & Treasury Management on Solana

SunPay is an on-chain payroll and treasury management protocol built on **Solana** using the **Anchor framework**.  
It enables organizations to create identities, manage workers with predefined salaries, fund a treasury, process batch payrolls, and perform secure withdrawals — all transparently and trustlessly.

---

## ✨ Features

- 🏢 **Organization Accounts**
  - Create and manage on-chain organization identities

- 👥 **Worker Management**
  - Add workers with fixed salaries
  - Salaries enforced at the protocol level

- 💰 **Treasury Funding**
  - Fund organization treasury with SOL
  - On-chain balance tracking

- 📦 **Batch Payroll Processing**
  - Process payroll for multiple workers in one transaction
  - Timestamp-based payroll cycles to prevent double payments

- 🔐 **Withdrawals**
  - Authorized treasury withdrawals
  - Secure signer and ownership checks


---

## 📜 Instructions

### Create Organization
Creates a new organization account.

```rust
create_org(ctx: Context<CreateOrgCtx>, name: String)
```

### Create Organization
Creates a new organization account.

```rust
create_org(ctx: Context<CreateOrgCtx>, name: String)
```

### Add Worker
Adds a worker to an organization with a fixed salary.

```rust
add_worker(ctx: Context<AddWorkerCtx>, salary: u64)
```

### Fund Treasury
Funds the organization treasury with SOL.

```rust
fund_treasury(ctx: Context<FundTreasuryCtx>, amount: u64)
```

### Process Payroll
Pays all registered workers for a given payroll cycle.

```rust
process_payroll(
    ctx: Context<ProcessPayrollCtx>,
    cycle_timestamp: u64,
)
```

### Withdraw Funds
Withdraws funds from the treasury by an authorized entity.

```rust
withdraw(ctx: Context<WithdrawCtx>, amount: u64)
```

---

## 🔐 Security Design

- Anchor-based account validation
- Signer & authority checks
- Treasury access restricted to organization authority
- Payroll cycle replay protection via timestamps

## 🎯 Use Cases

- DAOs managing contributor payrolls  
- Web3 startups running crypto-native salaries  
- Organizations needing transparent payroll accounting  
- Automated batch payments on Solana  

## 🗺️ Future Enhancements

- SPL token payroll support  
- Payroll history & receipts  
- DAO-based payroll approvals  
- Streaming / vesting salaries  
