# Running tests (pedidos-backend)

This folder includes a small pytest test for the `registro` lambda.

Setup (Windows/PowerShell):

```powershell
cd pedidos-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install -r requirements-dev.txt
pytest -q
```

Notes:
- Tests mock AWS resources; they do not require AWS credentials.
- Install both `requirements.txt` (lambda dependencies) and `requirements-dev.txt` (test tools).
- You can add more tests under `pedidos-backend/tests/` following the example `test_registro.py`.
