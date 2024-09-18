use crate::test_env::{backend_test_env, TestEnv};
use backend::{DeleteError, GetUserDataError, PrincipalName, UpdateError, UserData};
use candid::{Decode, Encode};
use pocket_ic::WasmResult;

pub struct BackendApi {
    env: TestEnv,
}

impl BackendApi {
    pub fn new() -> Self {
        Self {
            env: backend_test_env(),
        }
    }

    // get_userdata function ka test API
    pub fn get_userdata(&self) -> Result<UserData, GetUserDataError> {
        match self.env.pic.query_call(
            self.env.canister_id,
            self.env.sender,
            "get_userdata",
            Encode!().unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                Decode!(reply.as_slice(), Result<UserData, GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // insert_userdata function ka test API
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
                Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // insert_owned_principals function ka test API
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
                Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

    // Example for delete_owned_principal
    pub fn delete_owned_principal(&self, index: usize) -> Result<(), DeleteError> {
        match self.env.pic.update_call(
            self.env.canister_id,
            self.env.sender,
            "delete_owned_principal",
            Encode!(&index).unwrap(),
        ) {
            Ok(WasmResult::Reply(reply)) => {
                Decode!(reply.as_slice(), Result<(), DeleteError>).unwrap()
            }
            Ok(WasmResult::Reject(reject)) => {
                println!("Reject: {:?}", reject);
                panic!("Call rejected")
            }
            Err(err) => panic!("Call failed: {:?}", err),
        }
    }

// insert_known_principals function ka test API
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
            Decode!(reply.as_slice(), Result<(), GetUserDataError>).unwrap()
        }
        Ok(WasmResult::Reject(reject)) => {
            println!("Reject: {:?}", reject);
            panic!("Call rejected")
        }
        Err(err) => panic!("Call failed: {:?}", err),
    }
}

// delete_known_principal function ka test API
pub fn delete_known_principal(&self, index: usize) -> Result<(), DeleteError> {
    match self.env.pic.update_call(
        self.env.canister_id,
        self.env.sender,
        "delete_known_principal",
        Encode!(&index).unwrap(),
    ) {
        Ok(WasmResult::Reply(reply)) => Decode!(reply.as_slice(), Result<(), DeleteError>).unwrap(),
        Ok(WasmResult::Reject(reject)) => {
            println!("Reject: {:?}", reject);
            panic!("Call rejected")
        }
        Err(err) => panic!("Call failed: {:?}", err),
    }
}

// update_owned_principal_name function ka test API
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
        Ok(WasmResult::Reply(reply)) => Decode!(reply.as_slice(), Result<(), UpdateError>).unwrap(),
        Ok(WasmResult::Reject(reject)) => {
            println!("Reject: {:?}", reject);
            panic!("Call rejected")
        }
        Err(err) => panic!("Call failed: {:?}", err),
    }
}

// update_known_principal_name function ka test API
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
        Ok(WasmResult::Reply(reply)) => Decode!(reply.as_slice(), Result<(), UpdateError>).unwrap(),
        Ok(WasmResult::Reject(reject)) => {
            println!("Reject: {:?}", reject);
            panic!("Call rejected")
        }
        Err(err) => panic!("Call failed: {:?}", err),
    }
}

}

