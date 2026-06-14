"""
Test: TypeScript Type Definitions
===================================
Parses src/types/index.ts and validates that all expected interfaces
and their fields are defined. This catches accidental field deletions
or renames that would silently break the app at runtime.
"""

import re
from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest


@pytest.fixture(scope="module")
def types_source(project_root: Path) -> str:
    """Read the raw TypeScript types file."""
    types_path = project_root / "src" / "types" / "index.ts"
    with open(types_path, encoding="utf-8") as f:
        return f.read()


def _extract_interface_body(source: str, interface_name: str) -> str:
    """Extract the body of a TypeScript interface from source text."""
    pattern = rf"export\s+interface\s+{interface_name}\s*\{{(.*?)\}}"
    match = re.search(pattern, source, re.DOTALL)
    assert match, f"Interface '{interface_name}' not found in types/index.ts"
    return match.group(1)


def _get_field_names(body: str) -> list[str]:
    """Extract field names from an interface body (handles optional '?')."""
    fields = re.findall(r"(\w+)\??:", body)
    return fields


# ---------------------------------------------------------------------------
# Profile
# ---------------------------------------------------------------------------
PROFILE_REQUIRED_FIELDS = ["id", "name", "created_at"]
PROFILE_OPTIONAL_FIELDS = ["avatar_url", "house_id"]


class TestProfileInterface:
    def test_interface_exists(self, types_source: str):
        _extract_interface_body(types_source, "Profile")

    @pytest.mark.parametrize("field", PROFILE_REQUIRED_FIELDS)
    def test_required_field(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "Profile")
        fields = _get_field_names(body)
        assert field in fields, f"Profile missing required field: {field}"

    @pytest.mark.parametrize("field", PROFILE_OPTIONAL_FIELDS)
    def test_optional_field(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "Profile")
        fields = _get_field_names(body)
        assert field in fields, f"Profile missing optional field: {field}"


# ---------------------------------------------------------------------------
# House
# ---------------------------------------------------------------------------
HOUSE_FIELDS = ["id", "name", "invite_code", "created_at"]


class TestHouseInterface:
    def test_interface_exists(self, types_source: str):
        _extract_interface_body(types_source, "House")

    @pytest.mark.parametrize("field", HOUSE_FIELDS)
    def test_field_present(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "House")
        fields = _get_field_names(body)
        assert field in fields, f"House missing field: {field}"


# ---------------------------------------------------------------------------
# Chore
# ---------------------------------------------------------------------------
CHORE_FIELDS = [
    "id", "house_id", "title", "assigned_to",
    "interval_days", "due_date", "status",
]


class TestChoreInterface:
    def test_interface_exists(self, types_source: str):
        _extract_interface_body(types_source, "Chore")

    @pytest.mark.parametrize("field", CHORE_FIELDS)
    def test_field_present(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "Chore")
        fields = _get_field_names(body)
        assert field in fields, f"Chore missing field: {field}"

    def test_status_enum_values(self, types_source: str):
        """Status field must include pending, completed, overdue."""
        body = _extract_interface_body(types_source, "Chore")
        for status in ["pending", "completed", "overdue"]:
            assert status in body, (
                f"Chore status enum missing value: '{status}'"
            )


# ---------------------------------------------------------------------------
# Expense
# ---------------------------------------------------------------------------
EXPENSE_FIELDS = ["id", "house_id", "title", "amount", "paid_by", "created_at", "splits"]


class TestExpenseInterface:
    def test_interface_exists(self, types_source: str):
        _extract_interface_body(types_source, "Expense")

    @pytest.mark.parametrize("field", EXPENSE_FIELDS)
    def test_field_present(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "Expense")
        fields = _get_field_names(body)
        assert field in fields, f"Expense missing field: {field}"

    def test_splits_type_is_array(self, types_source: str):
        """splits field should reference ExpenseSplit[]."""
        body = _extract_interface_body(types_source, "Expense")
        assert "ExpenseSplit[]" in body, "Expense.splits should be ExpenseSplit[]"


# ---------------------------------------------------------------------------
# ExpenseSplit
# ---------------------------------------------------------------------------
EXPENSE_SPLIT_FIELDS = ["id", "expense_id", "user_id", "amount", "settled"]


class TestExpenseSplitInterface:
    def test_interface_exists(self, types_source: str):
        _extract_interface_body(types_source, "ExpenseSplit")

    @pytest.mark.parametrize("field", EXPENSE_SPLIT_FIELDS)
    def test_field_present(self, types_source: str, field: str):
        body = _extract_interface_body(types_source, "ExpenseSplit")
        fields = _get_field_names(body)
        assert field in fields, f"ExpenseSplit missing field: {field}"
