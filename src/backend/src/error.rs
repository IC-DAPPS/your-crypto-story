use serde::{Deserialize, Serialize};

#[derive(candid::CandidType, Clone, Serialize, Debug, Deserialize)]
pub enum GetUserDataError {
    AnonymousCaller,
    DidntFindUserData,
}
#[derive(candid::CandidType, Clone, Serialize, Debug, Deserialize)]
pub enum DeleteError {
    AnonymousCaller,
    DidntFindUserData,
    IndexOutOfBounds,
}
#[derive(candid::CandidType, Clone, Serialize, Debug, Deserialize)]
pub enum UpdateError {
    AnonymousCaller,
    DidntFindUserData,
    IndexOutOfBounds,
}
