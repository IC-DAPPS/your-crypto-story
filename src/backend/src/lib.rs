#[ic_cdk::query]
fn greet(t: String) -> String {
    format!("Hello, {}!", t)
}

#[ic_cdk::query]
fn whoami() -> String {
    let caller = ic_cdk::caller();
    format!("You are: {}", caller)
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
