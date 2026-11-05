#!/usr/bin/env python3
"""Build and validate the installable Solar Panel Visualizer release ZIP."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


RELEASE_FILES = (
    "solar-panel-visualizer.js",
    "hacs.json",
    "README.md",
    "LICENSE",
)
VERSION_PATTERN = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", required=True)
    parser.add_argument("--output-dir", type=Path, default=Path("dist"))
    args = parser.parse_args()

    if not VERSION_PATTERN.fullmatch(args.version):
        raise SystemExit("Version must use plain MAJOR.MINOR.PATCH format, such as 0.2.5.")

    root = Path.cwd()
    package = json.loads((root / "package.json").read_text())
    hacs = json.loads((root / "hacs.json").read_text())
    if package.get("version") != args.version:
        raise SystemExit(
            f"package.json version {package.get('version')} does not match {args.version}."
        )
    if hacs.get("filename") != RELEASE_FILES[0]:
        raise SystemExit("hacs.json filename does not match the packaged card bundle.")

    missing = [name for name in RELEASE_FILES if not (root / name).is_file()]
    if missing:
        raise SystemExit(f"Missing release files: {', '.join(missing)}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    archive_path = args.output_dir / f"solar-panel-visualizer-{args.version}.zip"
    with ZipFile(archive_path, "w", compression=ZIP_DEFLATED) as archive:
        for name in RELEASE_FILES:
            archive.write(root / name, arcname=name)

    with ZipFile(archive_path) as archive:
        if archive.namelist() != list(RELEASE_FILES):
            raise SystemExit("Release ZIP contents do not match the install package manifest.")
        corrupt_file = archive.testzip()
        if corrupt_file is not None:
            raise SystemExit(f"Release ZIP failed CRC validation at {corrupt_file}.")

    print(f"Created and verified {archive_path}")


if __name__ == "__main__":
    main()
