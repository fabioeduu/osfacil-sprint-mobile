#!/bin/bash

COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_DATE=$(git log -1 --format=%ai | cut -d' ' -f1)

cat > .env.local << EOF
EXPO_PUBLIC_COMMIT_HASH=${COMMIT_HASH}
EXPO_PUBLIC_BUILD_DATE=${COMMIT_DATE}
EOF

echo "✓ Build prepared with commit hash: ${COMMIT_HASH}"
echo "✓ Created .env.local with build information"
