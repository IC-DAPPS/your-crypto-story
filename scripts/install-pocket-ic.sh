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
LATEST_VERSION=$(curl -s https://api.github.com/repos/dfinity/pocketic/releases/latest | grep -oP '"tag_name": "\K(.*)(?=")')

# Download the correct version of PocketIC based on the detected OS
curl -L "https://github.com/dfinity/pocketic/releases/download/${LATEST_VERSION}/pocket-ic-x86_64-${OS}.gz" -o pocket-ic.gz

# Decompress and make the file executable
gzip -d pocket-ic.gz
chmod +x pocket-ic

# macOS-specific instructions for quarantine bypass
if [[ "$OS" == "darwin" ]]; then
    echo "On macOS, you might need to run: xattr -dr com.apple.quarantine pocket-ic"
fi

# Provide further instructions
echo "To run PocketIC, use: ./pocket-ic --help"
