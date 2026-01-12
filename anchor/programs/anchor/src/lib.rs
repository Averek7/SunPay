use anchor_lang::prelude::*;

declare_id!("Dn2cTrXQGiL14dHQBs8eM9gPy8nh9EsBgGErZHp5Pnxw");

#[program]
pub mod anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
