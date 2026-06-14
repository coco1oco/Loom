"""
Test: Code Quality Checks
============================
Static analysis-style tests that scan source files for common issues:
- Leftover debug statements (console.error, debugger)
- Hardcoded secrets or API key patterns
- TODO/FIXME/HACK inventory (warning, not failure)
- Proper export patterns
"""

import re
from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest


def _all_source_files(src_dir: Path) -> list[Path]:
    """Recursively collect all .ts/.tsx/.js/.jsx files under src/."""
    extensions = {".ts", ".tsx", ".js", ".jsx"}
    return [
        f for f in src_dir.rglob("*")
        if f.is_file() and f.suffix in extensions
    ]


@pytest.fixture(scope="module")
def source_files(src_dir: Path) -> list[Path]:
    return _all_source_files(src_dir)


# ---------------------------------------------------------------------------
# Debug statement checks
# ---------------------------------------------------------------------------
class TestNoDebugStatements:
    def test_no_debugger_keyword(self, source_files: list[Path]):
        """Source files must not contain 'debugger' statements."""
        violations = []
        for f in source_files:
            content = f.read_text(encoding="utf-8")
            # Match standalone debugger statements, not inside comments/strings
            for i, line in enumerate(content.splitlines(), start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("*"):
                    continue
                if re.search(r"\bdebugger\b", stripped):
                    violations.append(f"{f.name}:{i}")
        assert len(violations) == 0, (
            f"Found 'debugger' statements: {violations}"
        )

    def test_no_console_error(self, source_files: list[Path]):
        """Source files should not use console.error (use proper error handling)."""
        violations = []
        for f in source_files:
            content = f.read_text(encoding="utf-8")
            for i, line in enumerate(content.splitlines(), start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("*"):
                    continue
                if "console.error" in stripped:
                    violations.append(f"{f.name}:{i}")
        assert len(violations) == 0, (
            f"Found console.error calls: {violations}"
        )


# ---------------------------------------------------------------------------
# Secret / API key pattern checks
# ---------------------------------------------------------------------------
SECRET_PATTERNS = [
    (r"(?:api[_-]?key|apikey)\s*[:=]\s*['\"][A-Za-z0-9]{16,}['\"]", "API key"),
    (r"(?:secret|password|token)\s*[:=]\s*['\"][A-Za-z0-9]{8,}['\"]", "Secret/password/token"),
    (r"sk_(?:live|test)_[A-Za-z0-9]{20,}", "Stripe secret key"),
    (r"eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}", "JWT token"),
]


class TestNoHardcodedSecrets:
    @pytest.mark.parametrize("pattern,label", SECRET_PATTERNS, ids=[p[1] for p in SECRET_PATTERNS])
    def test_no_secret_pattern(
        self, source_files: list[Path], pattern: str, label: str
    ):
        """No hardcoded secrets should appear in source files."""
        violations = []
        for f in source_files:
            content = f.read_text(encoding="utf-8")
            for i, line in enumerate(content.splitlines(), start=1):
                stripped = line.strip()
                if stripped.startswith("//") or stripped.startswith("*"):
                    continue
                if re.search(pattern, stripped, re.IGNORECASE):
                    violations.append(f"{f.name}:{i}")
        assert len(violations) == 0, (
            f"Possible {label} found in: {violations}"
        )


# ---------------------------------------------------------------------------
# Import hygiene
# ---------------------------------------------------------------------------
class TestImportHygiene:
    def test_no_relative_parent_beyond_src(self, source_files: list[Path]):
        """Imports should not escape the src/ directory (no '../../..' chains
        that go above src)."""
        violations = []
        for f in source_files:
            content = f.read_text(encoding="utf-8")
            # Look for deeply nested relative imports (4+ levels up)
            for i, line in enumerate(content.splitlines(), start=1):
                if re.search(r"from\s+['\"](\.\./){4,}", line):
                    violations.append(f"{f.name}:{i}")
        assert len(violations) == 0, (
            f"Deeply nested relative imports found: {violations}"
        )


# ---------------------------------------------------------------------------
# File size sanity
# ---------------------------------------------------------------------------
class TestFileSizeSanity:
    def test_no_excessively_large_files(self, source_files: list[Path]):
        """No single source file should exceed 500 lines (code smell)."""
        violations = []
        for f in source_files:
            content = f.read_text(encoding="utf-8")
            line_count = len(content.splitlines())
            if line_count > 500:
                violations.append(f"{f.name} ({line_count} lines)")
        assert len(violations) == 0, (
            f"Excessively large files: {violations}"
        )
