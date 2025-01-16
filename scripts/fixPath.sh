#!/bin/bash

# Example usage
# replace_asset_paths "path/to/your/file.html"

file_path="$1"

if [[ ! -f "$file_path" ]]; then
    echo "Error: File not found at $file_path"
    return 1
fi

# Use sed to replace patterns in the file
sed -i.bak \
    -e 's|src="/assets/|src="/demo-tg-miniapp/assets/|g' \
    -e 's|href="/assets/|href="/demo-tg-miniapp/assets/|g' \
    "$file_path"

if [[ $? -eq 0 ]]; then
    echo "Successfully updated asset paths in $file_path"
    rm $file_path.bak
else
    echo "An error occurred while updating $file_path"
    return 1
fi
