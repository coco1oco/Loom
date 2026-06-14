"""
Test: Expo app.json Configuration
===================================
Ensures the Expo configuration has all required fields and sane values.
A broken app.json will cause build failures on all platforms.
"""

# pyrefly: ignore [missing-import]
import pytest


# ---------------------------------------------------------------------------
# Top-level structure
# ---------------------------------------------------------------------------
def test_expo_key_exists(app_json: dict):
    """app.json must have an 'expo' top-level key."""
    assert "expo" in app_json, "Missing top-level 'expo' key in app.json"


def _expo(app_json: dict) -> dict:
    """Helper — return the expo config block."""
    return app_json["expo"]


# ---------------------------------------------------------------------------
# Required fields
# ---------------------------------------------------------------------------
REQUIRED_EXPO_FIELDS = ["name", "slug", "version", "orientation", "scheme"]


@pytest.mark.parametrize("field", REQUIRED_EXPO_FIELDS)
def test_required_expo_field(app_json: dict, field: str):
    """Each required field must be present in the expo config."""
    expo = _expo(app_json)
    assert field in expo, f"Missing required expo field: {field}"


def test_app_name(app_json: dict):
    """App name must be 'Loom'."""
    assert _expo(app_json).get("name") == "Loom"


def test_app_slug(app_json: dict):
    """Slug must match the app name."""
    assert _expo(app_json).get("slug") == "Loom"


def test_orientation_portrait(app_json: dict):
    """Orientation must be portrait for this mobile app."""
    assert _expo(app_json).get("orientation") == "portrait"


# ---------------------------------------------------------------------------
# Platform configs
# ---------------------------------------------------------------------------
def test_ios_config_exists(app_json: dict):
    """iOS platform config block must be present."""
    assert "ios" in _expo(app_json), "Missing 'ios' config in app.json"


def test_android_config_exists(app_json: dict):
    """Android platform config block must be present."""
    assert "android" in _expo(app_json), "Missing 'android' config in app.json"


def test_web_config_exists(app_json: dict):
    """Web platform config block must be present."""
    assert "web" in _expo(app_json), "Missing 'web' config in app.json"


def test_web_output_static(app_json: dict):
    """Web output should be 'static' for SPA builds."""
    web = _expo(app_json).get("web", {})
    assert web.get("output") == "static", "web.output should be 'static'"


# ---------------------------------------------------------------------------
# Plugins
# ---------------------------------------------------------------------------
def test_expo_router_plugin(app_json: dict):
    """expo-router must be listed as a plugin."""
    plugins = _expo(app_json).get("plugins", [])
    # Plugins can be strings or [string, config] arrays
    plugin_names = []
    for p in plugins:
        if isinstance(p, str):
            plugin_names.append(p)
        elif isinstance(p, list) and len(p) > 0:
            plugin_names.append(p[0])
    assert "expo-router" in plugin_names, "expo-router missing from plugins"


# ---------------------------------------------------------------------------
# Experiments
# ---------------------------------------------------------------------------
def test_typed_routes_enabled(app_json: dict):
    """typedRoutes experiment should be enabled."""
    experiments = _expo(app_json).get("experiments", {})
    assert experiments.get("typedRoutes") is True, "typedRoutes should be enabled"
