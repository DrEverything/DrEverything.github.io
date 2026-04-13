import subprocess
import shutil
import os

cwd = os.getcwd()

shutil.rmtree(os.path.join(cwd, "node_modules", ".vite"), ignore_errors=True)
shutil.rmtree(os.path.join(cwd, ".svelte-kit"), ignore_errors=True)

subprocess.run(["bun", "run", "dev"], cwd=cwd)
