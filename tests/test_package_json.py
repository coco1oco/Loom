"""
Test: package.json Integrity
==============================
Validates that package.json contains the required dependencies, scripts,
and metadata for a healthy Loom build.
"""

import re

# pyrefly: ignore [missing-import]
import pytest


# ---------------------------------------------------------------------------
# Metadata
# ---------------------------------------------------------------------------
def test_package_name(package_json: dict):
    """Package name must be 'loom'."""
    assert package_json.get("name") == "loom"


def test_version_format(package_json: dict):
    """Version must follow semver (X.Y.Z)."""
    version = package_json.get("version", "")
    assert re.match(r"^\d+\.\d+\.\d+$", version), (
        f"Invalid version format: {version}"
    )


def test_main_entry(package_json: dict):
    """Main entry point must be set for expo-router."""
    assert package_json.get("main") == "expo-router/entry"


def test_private_flag(package_json: dict):
    """Package should be marked private (not publishable to npm)."""
    assert package_json.get("private") is True


# ---------------------------------------------------------------------------
# Required dependencies
# ---------------------------------------------------------------------------
REQUIRED_DEPS = [
    "expo",
    "expo-router",
    "react",
    "react-native",
    "react-dom",
    "react-native-web",
    "nativewind",
    "expo-status-bar",
    "expo-splash-screen",
    "react-native-safe-area-context",
    "react-native-screens",
    "react-native-gesture-handler",
    "react-native-reanimated",
]


@pytest.mark.parametrize("dep", REQUIRED_DEPS)
def test_required_dependency_present(package_json: dict, dep: str):
    """Each critical dependency must be listed in dependencies."""
    deps = package_json.get("dependencies", {})
    assert dep in deps, f"Missing required dependency: {dep}"


# ---------------------------------------------------------------------------
# Required scripts
# ---------------------------------------------------------------------------
REQUIRED_SCRIPTS = ["start", "android", "ios", "web", "lint"]


@pytest.mark.parametrize("script", REQUIRED_SCRIPTS)
def test_required_script_present(package_json: dict, script: str):
    """Each convenience script must be defined."""
    scripts = package_json.get("scripts", {})
    assert script in scripts, f"Missing required script: {script}"


# ---------------------------------------------------------------------------
# Dev-dependency sanity
# ---------------------------------------------------------------------------
def test_typescript_in_devdeps(package_json: dict):
    """TypeScript should be a devDependency."""
    devdeps = package_json.get("devDependencies", {})
    assert "typescript" in devdeps, "typescript missing from devDependencies"


def test_no_duplicate_deps(package_json: dict):
    """A package should not appear in both dependencies and devDependencies."""
    deps = set(package_json.get("dependencies", {}).keys())
    devdeps = set(package_json.get("devDependencies", {}).keys())
    overlap = deps & devdeps
    assert len(overlap) == 0, f"Duplicate packages in deps & devDeps: {overlap}"
