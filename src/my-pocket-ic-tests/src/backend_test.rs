use crate::backend_test_api::BackendApi;
use backend::error::GetUserDataError;
use backend::{DeleteError, PrincipalName, UpdateError};
use candid::Principal;

#[test]
fn test_insert_userdata() {
    let api = BackendApi::new();

    // Attempt to insert valid userdata
    let name = "Rahul".to_string();
    let email = Some("rahul@example.com".to_string());
    let result = api.insert_userdata(name.clone(), email.clone());

    // Check if the result is an AnonymousCaller error
    if let Err(GetUserDataError::AnonymousCaller) = result {
        println!("Received AnonymousCaller error as expected");
    } else {
        panic!("Expected AnonymousCaller error, but got: {:?}", result);
    }

    // Verify that no userdata was inserted due to the AnonymousCaller error
    let get_result = api.get_userdata();
    assert!(
        matches!(get_result, Err(GetUserDataError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        get_result
    );

    // Note: We cannot test successful insertions or updates in this environment due to the AnonymousCaller restriction

    println!("Test completed successfully");
}

// Test for inserting owned principals
#[test]
fn test_insert_owned_principals() {
    let api = BackendApi::new();

    // Attempt to insert owned principals
    let owned_principals = vec![
        PrincipalName {
            principal: Principal::from_text("r7inp-6aaaa-aaaaa-aaabq-cai").unwrap(),
            name: "name1".to_string(),
        },
        PrincipalName {
            principal: Principal::from_text("rwlgt-iiaaa-aaaaa-aaaaa-cai").unwrap(),
            name: "name2".to_string(),
        },
    ];
    let result = api.insert_owned_principals(owned_principals);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(GetUserDataError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Insert owned principals test completed successfully");
}

// Test for inserting known principals
#[test]
fn test_insert_known_principals() {
    let api = BackendApi::new();

    // Attempt to insert known principals
    let known_principals = vec![
        PrincipalName {
            principal: Principal::from_text("rkp4c-7iaaa-aaaaa-aaaca-cai").unwrap(),
            name: "name3".to_string(),
        },
        PrincipalName {
            principal: Principal::from_text("rno2w-sqaaa-aaaaa-aaacq-cai").unwrap(),
            name: "name4".to_string(),
        },
    ];
    let result = api.insert_known_principals(known_principals);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(GetUserDataError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Insert known principals test completed successfully");
}

// Test for deleting owned principal
#[test]
fn test_delete_owned_principal() {
    let api = BackendApi::new();

    // Attempt to delete an owned principal
    let result = api.delete_owned_principal(0);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(DeleteError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Delete owned principal test completed successfully");
}

// Test for deleting known principal
#[test]
fn test_delete_known_principal() {
    let api = BackendApi::new();

    // Attempt to delete a known principal
    let result = api.delete_known_principal(0);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(DeleteError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Delete known principal test completed successfully");
}

// Test for updating owned principal name
#[test]
fn test_update_owned_principal_name() {
    let api = BackendApi::new();

    // Attempt to update an owned principal's name
    let result = api.update_owned_principal_name("new_name".to_string(), 0);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(UpdateError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Update owned principal name test completed successfully");
}

// Test for updating known principal name
#[test]
fn test_update_known_principal_name() {
    let api = BackendApi::new();

    // Attempt to update a known principal's name
    let result = api.update_known_principal_name("new_name".to_string(), 0);

    // Check if the result is an AnonymousCaller error
    assert!(
        matches!(result, Err(UpdateError::AnonymousCaller)),
        "Expected AnonymousCaller error, but got: {:?}",
        result
    );

    println!("Update known principal name test completed successfully");
}
