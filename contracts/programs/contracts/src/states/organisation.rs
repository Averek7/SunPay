use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Organisation{
    pub authority: PubKey,
    #[max_len(100)]
    pub name: String,

    pub treasury: u64,
    pub workers_count: 64,

    pub created_at: i64,
    pub bump: u8
}

impl Organisation {
    pub const MAX_NAME_LEN: usize = 100;

    pub const INIT_SPACE: usize = 32
        + 4 + 100
        + 8
        + 8
        + 8
        + 1
}