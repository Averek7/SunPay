use anchor_lang::prelude::*;

#[error_code]
pub enum PayrollError {
    #[msg["Unauthorised Access"]]
    Unauthorised,

}