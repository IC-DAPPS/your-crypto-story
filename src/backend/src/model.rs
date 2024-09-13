use candid::Principal;
use candid::{Decode, Encode};
use ic_stable_structures::memory_manager::VirtualMemory;
use ic_stable_structures::storable::{Bound, Storable};
use ic_stable_structures::DefaultMemoryImpl;
use serde::{Deserialize, Serialize};
use std::borrow::Cow;

#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
pub struct PrincipalName {
    pub principal: Principal,
    pub name: String,
}

impl PrincipalName {
    pub fn update_name(&mut self, new_name: String) {
        self.name = new_name;
    }
    pub fn update_name_push() {}
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
pub struct UserData {
    pub owned_principals: Vec<PrincipalName>,
    pub known_principals: Vec<PrincipalName>,
    pub name: String,
    pub email: Option<String>,
}

pub type Memory = VirtualMemory<DefaultMemoryImpl>;

impl Storable for UserData {
    const BOUND: Bound = Bound::Unbounded;
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}
