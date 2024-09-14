use candid::Principal;

mod error;
mod model;
mod storage;

use error::{DeleteError, GetUserDataError, UpdateError};
use model::{PrincipalName, UserData};

#[ic_cdk::query]
fn get_userdata() -> Result<UserData, GetUserDataError> {
    let caller: Principal = ic_cdk::caller();
    let anonymous = Principal::anonymous();

    if caller == anonymous {
        return Err(GetUserDataError::AnonymousCaller);
    }

    let opt_user_data = storage::get(caller);
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

    match storage::get_mut(caller) {
        Some(_user_data) => Ok(()),
        None => {
            let new_user_data = UserData {
                owned_principals: Vec::new(),
                known_principals: Vec::new(),
                name,
                email,
            };
            storage::insert(caller, new_user_data);
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
    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if owned_principals_arg.len() == 0 {
                return Ok(());
            } else {
                for principal_name in owned_principals_arg {
                    user_data.owned_principals.push(principal_name);
                }
                storage::insert(caller, user_data);
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
    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if known_principals_arg.len() == 0 {
                return Ok(());
            } else {
                for principal_name in known_principals_arg {
                    user_data.known_principals.push(principal_name);
                }
                storage::insert(caller, user_data);
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

    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.owned_principals.len() {
                user_data.owned_principals.remove(index);
                storage::insert(caller, user_data);
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

    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.known_principals.len() {
                user_data.known_principals.remove(index);
                storage::insert(caller, user_data);
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

    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.owned_principals.len() {
                user_data.owned_principals[index].update_name(new_name);
                storage::insert(caller, user_data);
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

    match storage::get_mut(caller) {
        Some(mut user_data) => {
            if index < user_data.known_principals.len() {
                user_data.known_principals[index].update_name(new_name);
                storage::insert(caller, user_data);
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
