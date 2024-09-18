use candid::Principal;
use ic_agent::Identity;
use pocket_ic::PocketIc;
use std::env;
use std::path::{Path, PathBuf};

const TEST_IDENTITY_PEM: &str = "pocket_identity.pem";

const DISTRIBUTED_DIR: &str = "src/distributed";
const BACKEND_WASM: &str = "backend/backend.wasm.gz";

struct Config {
    cycles: u128,
    wasm_bytes: Vec<u8>,
    install_args: Option<Vec<u8>>,
    sender: Principal,
}

pub struct TestEnv {
    pub pic: PocketIc,
    pub canister_id: Principal,
    pub sender: Principal,
}

pub fn backend_test_env() -> TestEnv {
    init(default_config(BACKEND_WASM))
}

fn init(config: Config) -> TestEnv {
    let pic = PocketIc::new();

    let canister_id = pic.create_canister();

    pic.set_controllers(
        canister_id,
        Some(Principal::anonymous()),
        vec![config.sender],
    )
    .expect("Failed to set controllers");
    pic.add_cycles(canister_id, config.cycles);

    let install_args = config.install_args.unwrap_or(vec![]);
    pic.install_canister(
        canister_id,
        config.wasm_bytes,
        install_args,
        Some(config.sender),
    );

    TestEnv {
        pic,
        canister_id,
        sender: config.sender,
    }
}

fn default_config(wasm_dir: &str) -> Config {
    let sender = test_identity();

    Config {
        cycles: 10_000_000_000_000,
        wasm_bytes: std::fs::read(
            find_distributed_dir()
                .expect("Failed to find distributed directory")
                .join(wasm_dir),
        )
        .expect("Failed to read wasm file"),
        install_args: None,
        sender,
    }
}

fn test_identity() -> Principal {
    // We're changing this because there's an issue parsing the pem file
    // For now, we'll return a dummy Principal
    Principal::from_text("2vxsx-fae").expect("Failed to create dummy principal")
}

fn find_distributed_dir() -> Option<PathBuf> {
    let mut current_dir = env::current_dir().ok()?;

    loop {
        let distributed_dir = current_dir.join(DISTRIBUTED_DIR);

        if distributed_dir.is_dir() {
            return Some(distributed_dir);
        }

        if !current_dir.pop() {
            return None;
        }
    }
}
