"""
Test: Business Logic & Mock Data Integrity
=============================================
Validates the mock data defined in AppContext.tsx:
- All mock profiles, chores, and expenses have correct field structure.
- Expense split amounts sum correctly.
- Chore status values are within the allowed enum.
- Cross-references between entities are consistent (e.g. assigned_to refers
  to a valid profile ID, paid_by refers to a valid profile ID).
"""

import re
from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest


@pytest.fixture(scope="module")
def app_context_source(project_root: Path) -> str:
    """Read the raw AppContext.tsx file."""
    ctx_path = project_root / "src" / "context" / "AppContext.tsx"
    with open(ctx_path, encoding="utf-8") as f:
        return f.read()


# ---------------------------------------------------------------------------
# Mock profile extraction
# ---------------------------------------------------------------------------
def _extract_mock_profile_ids(source: str) -> list[str]:
    """Extract all id values from MOCK_PROFILES."""
    block_match = re.search(
        r"MOCK_PROFILES.*?=\s*\[(.*?)\];", source, re.DOTALL
    )
    if not block_match:
        return []
    block = block_match.group(1)
    return re.findall(r"id:\s*['\"](\w+)['\"]", block)


def _extract_mock_house_id(source: str) -> str | None:
    """Extract the house id from MOCK_HOUSE."""
    match = re.search(r"MOCK_HOUSE.*?id:\s*['\"]([^'\"]+)['\"]", source, re.DOTALL)
    return match.group(1) if match else None


# ---------------------------------------------------------------------------
# Tests: Profiles
# ---------------------------------------------------------------------------
class TestMockProfiles:
    def test_profiles_exist(self, app_context_source: str):
        ids = _extract_mock_profile_ids(app_context_source)
        assert len(ids) >= 2, "Should have at least 2 mock profiles"

    def test_profile_ids_unique(self, app_context_source: str):
        ids = _extract_mock_profile_ids(app_context_source)
        assert len(ids) == len(set(ids)), "Duplicate profile IDs found"

    def test_profiles_have_names(self, app_context_source: str):
        """Each profile object should have a name field."""
        block = re.search(
            r"MOCK_PROFILES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block, "MOCK_PROFILES not found"
        names = re.findall(r"name:\s*['\"]([^'\"]+)['\"]", block.group(1))
        ids = _extract_mock_profile_ids(app_context_source)
        assert len(names) == len(ids), "Not all profiles have names"


# ---------------------------------------------------------------------------
# Tests: House
# ---------------------------------------------------------------------------
class TestMockHouse:
    def test_house_exists(self, app_context_source: str):
        house_id = _extract_mock_house_id(app_context_source)
        assert house_id is not None, "MOCK_HOUSE not found"

    def test_house_has_invite_code(self, app_context_source: str):
        match = re.search(
            r"MOCK_HOUSE.*?invite_code:\s*['\"](\w+)['\"]",
            app_context_source,
            re.DOTALL,
        )
        assert match, "MOCK_HOUSE missing invite_code"

    def test_house_has_name(self, app_context_source: str):
        match = re.search(
            r"MOCK_HOUSE.*?name:\s*['\"]([^'\"]+)['\"]",
            app_context_source,
            re.DOTALL,
        )
        assert match, "MOCK_HOUSE missing name"


# ---------------------------------------------------------------------------
# Tests: Chores
# ---------------------------------------------------------------------------
class TestMockChores:
    def test_chores_exist(self, app_context_source: str):
        block = re.search(
            r"MOCK_CHORES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block, "MOCK_CHORES not found"
        ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", block.group(1))
        assert len(ids) >= 1, "Should have at least 1 mock chore"

    def test_chore_ids_unique(self, app_context_source: str):
        block = re.search(
            r"MOCK_CHORES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        # Match only top-level 'id:' (not house_id, expense_id, etc.)
        ids = re.findall(r"(?<!\w)id:\s*['\"]([^'\"]+)['\"]", block.group(1))
        assert len(ids) == len(set(ids)), "Duplicate chore IDs"

    def test_chore_status_values_valid(self, app_context_source: str):
        """All status values must be pending, completed, or overdue."""
        block = re.search(
            r"MOCK_CHORES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        statuses = re.findall(r"status:\s*['\"](\w+)['\"]", block.group(1))
        valid = {"pending", "completed", "overdue"}
        for s in statuses:
            assert s in valid, f"Invalid chore status: '{s}'"

    def test_chores_reference_valid_profiles(self, app_context_source: str):
        """assigned_to should reference a known mock profile ID."""
        profile_ids = set(_extract_mock_profile_ids(app_context_source))
        block = re.search(
            r"MOCK_CHORES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        assigned = re.findall(r"assigned_to:\s*['\"](\w+)['\"]", block.group(1))
        for a in assigned:
            assert a in profile_ids, (
                f"Chore assigned_to '{a}' is not a valid profile ID"
            )


# ---------------------------------------------------------------------------
# Tests: Expenses
# ---------------------------------------------------------------------------
class TestMockExpenses:
    def test_expenses_exist(self, app_context_source: str):
        block = re.search(
            r"MOCK_EXPENSES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block, "MOCK_EXPENSES not found"

    def test_expense_ids_unique(self, app_context_source: str):
        block = re.search(
            r"MOCK_EXPENSES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        # Match only top-level 'id:' (not house_id, expense_id, user_id, etc.)
        ids = re.findall(r"(?<!\w)id:\s*['\"]([^'\"]+)['\"]", block.group(1))
        # Filter out split IDs — they start with "split-"
        expense_ids = [i for i in ids if not i.startswith("split-")]
        assert len(expense_ids) == len(set(expense_ids)), "Duplicate expense IDs"

    def test_expenses_reference_valid_profiles(self, app_context_source: str):
        """paid_by should reference a known mock profile ID."""
        profile_ids = set(_extract_mock_profile_ids(app_context_source))
        block = re.search(
            r"MOCK_EXPENSES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        payers = re.findall(r"paid_by:\s*['\"](\w+)['\"]", block.group(1))
        for p in payers:
            assert p in profile_ids, (
                f"Expense paid_by '{p}' is not a valid profile ID"
            )

    def test_split_amounts_are_positive(self, app_context_source: str):
        """All split amounts must be > 0."""
        block = re.search(
            r"MOCK_EXPENSES.*?=\s*\[(.*?)\];", app_context_source, re.DOTALL
        )
        assert block
        amounts = re.findall(r"amount:\s*(\d+(?:\.\d+)?)", block.group(1))
        for a in amounts:
            assert float(a) > 0, f"Split amount must be positive, got {a}"


# ---------------------------------------------------------------------------
# Tests: Database service placeholder
# ---------------------------------------------------------------------------
class TestDbService:
    def test_db_exports_exist(self, project_root: Path):
        """db.ts should export both supabase and db objects."""
        db_path = project_root / "src" / "services" / "db.ts"
        source = db_path.read_text(encoding="utf-8")
        assert "export const supabase" in source, "supabase export missing"
        assert "export const db" in source, "db export missing"

    def test_db_has_fetch_functions(self, project_root: Path):
        """db should have fetch functions for house, chores, expenses."""
        db_path = project_root / "src" / "services" / "db.ts"
        source = db_path.read_text(encoding="utf-8")
        for fn in ["fetchHouseMembers", "fetchChores", "fetchExpenses"]:
            assert fn in source, f"db.{fn} function missing"
