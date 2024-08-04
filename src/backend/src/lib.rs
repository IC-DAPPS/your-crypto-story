use candid::Principal;
use candid::{Decode, Encode};
use serde::{Deserialize, Serialize};

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{
    storable::{Bound, Storable},
    DefaultMemoryImpl, StableBTreeMap,
};
use std::cell::RefCell;

use std::borrow::Cow;

#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
struct PrincipalName {
    principal: Principal,
    name: String,
}

impl PrincipalName {
    fn update_name(&mut self, new_name: String) {
        self.name = new_name;
    }
    fn update_name_push() {}
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize, Default)]
struct UserData {
    owned_principals: Vec<PrincipalName>,
    known_principals: Vec<PrincipalName>,
    name: String,
    email: Option<String>,
}

type Memory = VirtualMemory<DefaultMemoryImpl>;

impl Storable for UserData {
    // Required methods
    const BOUND: Bound = Bound::Unbounded;
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }
}

#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
enum GetUserDataError {
    AnonymousCaller,
    DidntFindUserData,
}
#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
enum DeleteError {
    AnonymousCaller,
    DidntFindUserData,
    IndexOutOfBounds,
}
#[derive(candid::CandidType, Clone, Serialize, Deserialize)]
enum UpdateError {
    AnonymousCaller,
    DidntFindUserData,
    IndexOutOfBounds,
}

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    // Initialize a `StableBTreeMap` with `MemoryId(0)`.
    static MAP: RefCell<StableBTreeMap<Principal, UserData, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

// Retrieves the value associated with the given key if it exists.

fn get(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow().get(&key))
}

fn get_mut(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().get(&key))
}

// Inserts an entry into the map and returns the previous value of the key if it exists.

fn insert(key: Principal, value: UserData) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().insert(key, value))
}

fn remove(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().remove(&key))
}

#[ic_cdk::query]
fn get_userdata() -> Result<UserData, GetUserDataError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();

    if caller == anonymous {
        return Err(GetUserDataError::AnonymousCaller);
    }

    let opt_user_data = get(caller);
    match opt_user_data {
        Some(user_data) => Ok(user_data),
        None => Err(GetUserDataError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn insert_userdata(name: String, email: Option<String>) -> Result<(), GetUserDataError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();

    if caller == anonymous {
        return Err(GetUserDataError::AnonymousCaller);
    }

    match get_mut(caller) {
        Some(_user_data) => Ok(()),
        None => {
            let new_user_data = UserData {
                owned_principals: Vec::new(),
                known_principals: Vec::new(),
                name,
                email,
            };
            insert(caller, new_user_data);
            Ok(())
        }
    }
}

#[ic_cdk::update]
fn insert_owned_principals(
    owned_principals_arg: Vec<PrincipalName>,
) -> Result<(), GetUserDataError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(GetUserDataError::AnonymousCaller);
    }
    match get_mut(caller) {
        Some(mut user_data) => {
            if owned_principals_arg.len() == 0 {
                return Ok(());
            } else {
                for principal_name in owned_principals_arg {
                    user_data.owned_principals.push(principal_name);
                }
                Ok(())
            }
        }
        None => Err(GetUserDataError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn insert_known_principals(
    known_principals_arg: Vec<PrincipalName>,
) -> Result<(), GetUserDataError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(GetUserDataError::AnonymousCaller);
    }
    match get_mut(caller) {
        Some(mut user_data) => {
            if known_principals_arg.len() == 0 {
                return Ok(());
            } else {
                for principal_name in known_principals_arg {
                    user_data.known_principals.push(principal_name);
                }
                Ok(())
            }
        }
        None => Err(GetUserDataError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn delete_owned_principal(index: usize) -> Result<(), DeleteError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(DeleteError::AnonymousCaller);
    }

    match get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.owned_principals.len() {
                user_data.owned_principals.remove(index);
                Ok(())
            } else {
                Err(DeleteError::IndexOutOfBounds)
            }
        }
        None => Err(DeleteError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn delete_known_principal(index: usize) -> Result<(), DeleteError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(DeleteError::AnonymousCaller);
    }

    match get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.known_principals.len() {
                user_data.known_principals.remove(index);
                Ok(())
            } else {
                Err(DeleteError::IndexOutOfBounds)
            }
        }
        None => Err(DeleteError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn update_owned_principal_name(new_name: String, index: usize) -> Result<(), UpdateError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(UpdateError::AnonymousCaller);
    }

    match get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.owned_principals.len() {
                user_data.owned_principals[index].update_name(new_name);
                Ok(())
            } else {
                Err(UpdateError::IndexOutOfBounds)
            }
        }
        None => Err(UpdateError::DidntFindUserData),
    }
}

#[ic_cdk::update]
fn update_known_principal_name(new_name: String, index: usize) -> Result<(), UpdateError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();
    if caller == anonymous {
        return Err(UpdateError::AnonymousCaller);
    }

    match get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.known_principals.len() {
                user_data.known_principals[index].update_name(new_name);
                Ok(())
            } else {
                Err(UpdateError::IndexOutOfBounds)
            }
        }
        None => Err(UpdateError::DidntFindUserData),
    }
}

#[test]
fn generate_candid() {
    candid::export_service!();

    std::fs::write("../distributed/backend/backend.did", __export_service())
        .expect("Failed to write backend.did");
}

// #[test]
// fn generate_candid() {
//     use std::fs;
//     use std::path::Path;

//     candid::export_service!();

//     let dir_path = Path::new("../../distributed/backend");
//     let file_path = dir_path.join("backend.did");
//     println!("File exists: {:?}", file_path.exists());
//     fs::create_dir_all(dir_path).expect("Failed to create directory");
//     fs::write(file_path, __export_service()).expect("Failed to write backend.did");
// }
