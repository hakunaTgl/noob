# noob

An experimentation workspace containing the `SmartHubUltraMAXX` application directory with Python backend code and HTML/JS/CSS assets.

> Status: scaffold / early development. The repository structure exists, but runtime behavior and supported features must be verified before production use.

## Requirements

- Python 3.10 or newer
- A virtual environment is recommended

## Setup

```bash
git clone https://github.com/hakunaTgl/noob.git
cd noob
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt -r SmartHubUltraMAXX/requirements.txt
```

## Run

Inspect the application entry points before execution:

```bash
find SmartHubUltraMAXX -maxdepth 2 -type f | sort
```

No stable CLI or service entry point is documented yet. Add one before marking this project runnable.

## Repository map

- `SmartHubUltraMAXX/` — application directory
- `requirements.txt` — root Python dependencies
- `SmartHubUltraMAXX/requirements.txt` — application dependencies, including `joblib`

## Completion checklist

- [ ] Define and document the supported entry point
- [ ] Add `.env.example` if configuration is required
- [ ] Add automated tests
- [ ] Add a license
- [ ] Verify setup from a clean clone
