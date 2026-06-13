import sys

name = "Krystian"
student_id = "57798"
python_version = sys.version.split()[0]
python_path = sys.executable

print(f"Hello {name} ({student_id}). This environment is using Python version {python_version} at location {python_path}.")
