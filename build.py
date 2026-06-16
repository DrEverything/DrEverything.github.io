import subprocess
import shutil
import sys
from pathlib import Path


def main():
    # Step 1: bun run build
    print("Running bun build...")
    result = subprocess.run(["bun", "run", "build"], check=True)

    # Step 2: Copy build/* to ../main-server/public
    src = Path("build")
    dest = Path("../main-server/public")

    if not src.exists():
        print(
            f"Error: '{src}' directory not found after build.", file=sys.stderr)
        sys.exit(1)

    dest.mkdir(parents=True, exist_ok=True)

    print(f"Copying {src}/ -> {dest}/")
    for item in src.iterdir():
        s = src / item.name
        d = dest / item.name
        if s.is_dir():
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)

    print("Done.")


if __name__ == "__main__":
    main()
