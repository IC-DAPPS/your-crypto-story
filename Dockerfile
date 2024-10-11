# Build stage
FROM rust:latest AS builder

WORKDIR /usr/src/myapp

# Copy necessary files
COPY Cargo.toml .
COPY src/distributed ./src/distributed
COPY src/my-pocket-ic-tests ./src/my-pocket-ic-tests
COPY src/backend ./src/backend

# Build dependencies
RUN cargo build --package my-pocket-ic-tests

# Final stage
FROM rust:latest

WORKDIR /usr/src/myapp

# Copy built artifacts from builder stage
COPY --from=builder /usr/src/myapp/target ./target
COPY --from=builder /usr/src/myapp/Cargo.toml .
COPY --from=builder /usr/src/myapp/src/distributed ./src/distributed
COPY --from=builder /usr/src/myapp/src/my-pocket-ic-tests ./src/my-pocket-ic-tests
COPY --from=builder /usr/src/myapp/src/backend ./src/backend

# Download and install PocketIC
RUN curl -fsSL https://github.com/dfinity/pocketic/releases/download/5.0.0/pocket-ic-x86_64-linux.gz -o pocket-ic.gz && \
    gzip -d pocket-ic.gz && \
    chmod +x pocket-ic && \
    mv pocket-ic /usr/local/bin/

# Set environment variables
ENV RUST_BACKTRACE=1
ENV RUST_LOG=debug
ENV POCKET_IC_BIN=/usr/local/bin/pocket-ic

# Verify PocketIC installation, save version, and set as environment variable
RUN POCKET_IC_VERSION=$(pocket-ic --version) && \
    echo "PocketIC version: ${POCKET_IC_VERSION}" && \
    echo "POCKET_IC_VERSION=${POCKET_IC_VERSION}" >> /etc/environment && \
    echo "export POCKET_IC_VERSION=${POCKET_IC_VERSION}" >> ~/.bashrc

# Run tests
CMD ["/bin/bash", "-c", "echo PocketIC version: $(pocket-ic --version) && echo 'Running tests:' && cargo test --package my-pocket-ic-tests test_insert_userdata -- --nocapture"]