"""
Test: Project Structure Validation
===================================
Ensures all required files and directories exist in the Loom project tree.
A missing file here usually means a bad merge or accidental deletion.
"""

from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest


# ---------------------------------------------------------------------------
# Required top-level files
# ---------------------------------------------------------------------------
TOP_LEVEL_FILES = [
    "package.json",
    "package-lock.json",
    "app.json",
    "tsconfig.json",
    "babel.config.js",
    "metro.config.js",
    "tailwind.config.js",
    ".gitignore",
    "README.md",
]


@pytest.mark.parametrize("filename", TOP_LEVEL_FILES)
def test_top_level_file_exists(project_root: Path, filename: str):
    """Each critical config/build file must be present at the repo root."""
    assert (project_root / filename).is_file(), f"Missing required file: {filename}"


# ---------------------------------------------------------------------------
# Required directories
# ---------------------------------------------------------------------------
REQUIRED_DIRS = [
    "src",
    "src/app",
    "src/components",
    "src/context",
    "src/hooks",
    "src/services",
    "src/types",
    "assets",
    "scripts",
]


@pytest.mark.parametrize("dirname", REQUIRED_DIRS)
def test_required_directory_exists(project_root: Path, dirname: str):
    """Each required directory must be present."""
    assert (project_root / dirname).is_dir(), f"Missing required directory: {dirname}"


# ---------------------------------------------------------------------------
# Required source files
# ---------------------------------------------------------------------------
REQUIRED_SOURCE_FILES = [
    "src/app/_layout.tsx",
    "src/app/index.tsx",
    "src/app/chores.tsx",
    "src/app/expenses.tsx",
    "src/app/settings.tsx",
    "src/context/AppContext.tsx",
    "src/services/db.ts",
    "src/types/index.ts",
    "src/global.css",
]


@pytest.mark.parametrize("filepath", REQUIRED_SOURCE_FILES)
def test_required_source_file_exists(project_root: Path, filepath: str):
    """Each core source file must be present."""
    assert (project_root / filepath).is_file(), f"Missing source file: {filepath}"


# ---------------------------------------------------------------------------
# Required component files
# ---------------------------------------------------------------------------
REQUIRED_COMPONENTS = [
    "src/components/app-tabs.tsx",
    "src/components/themed-text.tsx",
    "src/components/themed-view.tsx",
]


@pytest.mark.parametrize("filepath", REQUIRED_COMPONENTS)
def test_required_component_exists(project_root: Path, filepath: str):
    """Key shared components must be present."""
    assert (project_root / filepath).is_file(), f"Missing component: {filepath}"


# ---------------------------------------------------------------------------
# Assets
# ---------------------------------------------------------------------------
def test_assets_directory_not_empty(project_root: Path):
    """The assets directory should contain at least one file."""
    assets = project_root / "assets"
    children = list(assets.iterdir())
    assert len(children) > 0, "assets/ directory is empty"
