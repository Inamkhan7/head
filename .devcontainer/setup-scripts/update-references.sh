#!/bin/bash

ports=(3000 3001 3003)  # Add more ports if needed
codespace_name=$CODESPACE_NAME
for port in "${ports[@]}"; do
    replacement_url="https://${codespace_name}-${port}.app.github.dev"
    find . -type f -name "*" -exec sed -i "s|http://localhost:$port|$replacement_url|g" {} +
done
echo "Localhost references have been updated with custom URLs."
