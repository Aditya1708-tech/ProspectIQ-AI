import sys
import os
import pytest

# Ensure absolute 'app' path is at the front of sys.path
app_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'app'))
if app_path in sys.path:
  sys.path.remove(app_path)
sys.path.insert(0, app_path)

# Remove the root directory if it's shadowing the engines package
root_path = os.path.abspath(os.path.dirname(__file__))
while root_path in sys.path:
  sys.path.remove(root_path)

# Also insert app_path to the env PYTHONPATH just in case subprocesses are spawned
os.environ['PYTHONPATH'] = app_path

print(f"Running pytest with sys.path: {sys.path[:3]} ...")
sys.exit(pytest.main(sys.argv[1:]))
