# bunx sharp-cli --input static/favicon.svg --output static/icon-192.png resize 192 192
# bunx sharp-cli --input static/favicon.svg --output static/icon-512.png resize 512 512

bun run build
cp -Recurse -Force build\* ..\main-server\public
