use crate::test_env::{backend_test_env, TestEnv};
use backend::{DeleteError, GetUserDataError, PrincipalName, UpdateError, UserData};
use candid::{Decode, Encode};
use pocket_ic::WasmResult;

// BackendApi struct represents the API for interacting with the backend canister
pub struct BackendApi {
    env: TestEnv,
}

impl BackendApi {
    // Create a new instance of BackendApi
    pub fn new() -> Self {
        Self {
            env: backend_test_env(),
        }
    }

    // Test API for the get_userdata function
    // Retrieves user data from the canister
    pub fn get_userdata(&self) -> Result<UserData, GetUserDataError> {
        match self.env.pic.query_call(
            self.env.canister_id,
            self.env.sender,
            "get_userdata",
            Encode!().unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<UserData, GetUserDataError>
                Decode!(reply.as_slice(), Result<UserData, GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the insert_userdata function
    // Inserts new user data into the canister
    pub fn insert_userdata(
        &self,
        name: String,
        email: Option<String>,
    ) -> Result<(), GetUserDataError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "insert_userdata",
            Encode!(&name, &email).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), GetUserDataError>
                Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the insert_owned_principals function
    // Inserts a list of owned principals into the canister
    pub fn insert_owned_principals(
        &self,
        owned_principals: Vec<PrincipalName>,
    ) -> Result<(), GetUserDataError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "insert_owned_principals",
            Encode!(&owned_principals).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), GetUserDataError>
                Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the delete_owned_principal function
    // Deletes an owned principal at the specified index
    pub fn delete_owned_principal(&self, index: usize) -> Result<(), DeleteError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "delete_owned_principal",
            Encode!(&index).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), DeleteError>
                Decode!(reply.as_slice(), Result<(), DeleteError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the insert_known_principals function
    // Inserts a list of known principals into the canister
    pub fn insert_known_principals(
        &self,
        known_principals: Vec<PrincipalName>,
    ) -> Result<(), GetUserDataError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "insert_known_principals",
            Encode!(&known_principals).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), GetUserDataError>
                Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the delete_known_principal function
    // Deletes a known principal at the specified index
    pub fn delete_known_principal(&self, index: usize) -> Result<(), DeleteError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "delete_known_principal",
            Encode!(&index).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), DeleteError>
                Decode!(reply.as_slice(), Result<(), DeleteError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the update_owned_principal_name function
    // Updates the name of an owned principal at the specified index
    pub fn update_owned_principal_name(
        &self,
        new_name: String,
        index: usize,
    ) -> Result<(), UpdateError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "update_owned_principal_name",
            Encode!(&new_name, &index).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), UpdateError>
                Decode!(reply.as_slice(), Result<(), UpdateError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Test API for the update_known_principal_name function
    // Updates the name of a known principal at the specified index
    pub fn update_known_principal_name(
        &self,
        new_name: String,
        index: usize,
    ) -> Result<(), UpdateError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "update_known_principal_name",
            Encode!(&new_name, &index).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                // Decode the reply into a Result<(), UpdateError>
                Decode!(reply.as_slice(), Result<(), UpdateError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                // Log the rejection and panic
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

}
