"""
Shared pytest fixtures for the Loom test suite.

Provides path helpers and file content loaders so individual test modules
don't have to compute project paths themselves.
"""

import json
import os
from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest


@pytest.fixture(scope="session")
def project_root() -> Path:
    """Return the absolute path to the Loom project root."""
    # tests/ lives one level below the project root
    return Path(__file__).resolve().parent.parent


@pytest.fixture(scope="session")
def src_dir(project_root: Path) -> Path:
    """Return the path to src/."""
    return project_root / "src"


@pytest.fixture(scope="session")
def package_json(project_root: Path) -> dict:
    """Load and parse package.json."""
    pkg_path = project_root / "package.json"
    with open(pkg_path, encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="session")
def app_json(project_root: Path) -> dict:
    """Load and parse app.json."""
    app_path = project_root / "app.json"
    with open(app_path, encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture(scope="session")
def tsconfig_json(project_root: Path) -> dict:
    """Load and parse tsconfig.json."""
    ts_path = project_root / "tsconfig.json"
    with open(ts_path, encoding="utf-8") as f:
        return json.load(f)


def read_text(path: Path) -> str:
    """Utility — read a file as UTF-8 text."""
    with open(path, encoding="utf-8") as f:
        return f.read()
