#!/bin/bash

# Detect the operating system
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="darwin"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
else
    echo "Unsupported OS"
    exit 1
fi

# Fetch the latest version of PocketIC from GitHub API
LATEST_VERSION=$(curl -s https://api.github.com/repos/dfinity/pocketic/releases/latest | grep '"tag_name"' | cut -d '"' -f 4)

# Check if the version was fetched
if [ -z "$LATEST_VERSION" ]; then
    echo "Failed to fetch the latest version of PocketIC."
    exit 1
fi

# Download the correct version of PocketIC based on the detected OS
curl -L -o pocket-ic.gz "https://github.com/dfinity/pocketic/releases/download/${LATEST_VERSION}/pocket-ic-x86_64-${OS}.gz"

# Verify if the downloaded file is indeed a gzip file
if file pocket-ic.gz | grep -q "gzip compressed data"; then
    # Decompress and make the file executable
    gzip -d pocket-ic.gz
    chmod +x pocket-ic
else
    echo "Downloaded file is not in gzip format."
    exit 1
fi

# macOS-specific instructions for quarantine bypass
if [[ "$OS" == "darwin" ]]; then
    echo "On macOS, you might need to run: xattr -dr com.apple.quarantine pocket-ic"
    xattr -dr com.apple.quarantine pocket-ic
fi

# Provide further instructions
echo "To run PocketIC, use: ./pocket-ic --help"
