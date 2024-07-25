use std::collections::{hash_map, HashMap};

use candid::Principal;

// Define a struct with both mutable and immutable fields
struct User {
    name: String, // Immutable field
    age: u32,     // Mutable field
}

impl User {
    // Method to update the age field
    fn update_age(&mut self, new_age: u32) {
        self.age = new_age;
    }

    // Method to get the name (immutable reference)
    fn get_name(&self) -> &str {
        &self.name
    }
}

fn main() {
    // Create an instance of the struct
    let mut user = User {
        name: String::from("Alice"),
        age: 30,
    };

    let mut map: HashMap<Principal, &User> = HashMap::new();

    map.insert(Principal::from_text("dsfsdfsd").unwrap(), &user);

    // Access the immutable field
    println!("Name: {}", user.name);

    // Mutate the mutable field using a method
    user.update_age(35);

    // Access the updated mutable field
    println!("Updated Age: {}", user.age);
}
