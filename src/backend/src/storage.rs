use super::model::{Memory, UserData};
use super::Principal;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static MAP: RefCell<StableBTreeMap<Principal, UserData, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

pub fn get(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow().get(&key))
}

pub fn get_mut(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().get(&key))
}

pub fn insert(key: Principal, value: UserData) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().insert(key, value))
}

pub fn remove(key: Principal) -> Option<UserData> {
    MAP.with(|p| p.borrow_mut().remove(&key))
}
