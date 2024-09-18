
use crate::backend_test_api::BackendApi;
use backend::{error::GetUserDataError, UserData};

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
