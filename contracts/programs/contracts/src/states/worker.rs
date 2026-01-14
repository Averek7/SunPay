use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]

pub struct Worker{
    pub org: PubKey,

    pub worker_pubkey: PubKey,

    pub salary: u64,

    pub last_paid_cycle: u64,

    pub created_at: i64,
    pub bump: u8
} 

impl Worker {
    pub const INIT_SPACE: usize = 32
        + 32
        + 8
        + 8
        + 8
        + 1
}