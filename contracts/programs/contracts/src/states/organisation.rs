use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Organization {
    pub authority: Pubkey,
    #[max_len(100)]
    pub name: String,
    pub treasury: u64,
    pub workers_count: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl Organization {
    pub const MAX_NAME_LEN: usize = 100;
}
