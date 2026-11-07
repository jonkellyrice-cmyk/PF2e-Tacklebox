"""Validate and package a Foundry module using only the standard library."""

import argparse
import json
import re
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "module"
DIST = ROOT / "dist"


def require(condition, message):
    if not condition:
        raise SystemExit(message)


def check_path(relative, *, directory=False):
    path = (SOURCE / relative).resolve()
    require(path.is_relative_to(SOURCE), f"Path outside module: {relative}")
    require(path.is_dir() if directory else path.is_file(), f"Missing: {relative}")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True, help="GitHub owner/repository")
    parser.add_argument("--tag", help="Release tag; must equal v plus the manifest version")
    args = parser.parse_args()
    require(re.fullmatch(r"[\w.-]+/[\w.-]+", args.repo), "Expected owner/repository")
    manifest = json.loads(check_path("module.json").read_text(encoding="utf-8"))
    for field in ("title", "description", "authors", "compatibility"):
        require(manifest.get(field), f"Missing manifest field: {field}")
    require(re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", manifest["id"]), "Invalid module ID")
    version = manifest["version"]
    require(re.fullmatch(r"(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)", version),
            "Use a three-part release version")
    tag = f"v{version}"
    require(args.tag is None or args.tag == tag, f"Expected release tag {tag}")
    systems = manifest["relationships"]["systems"]
    require(any(s["id"] == "pf2e" and s["type"] == "system" for s in systems),
            "Declare the pf2e system relationship")
    for field in ("esmodules", "scripts", "styles"):
        for relative in manifest.get(field, []):
            check_path(relative)
    for language in manifest.get("languages", []):
        json.loads(check_path(language["path"]).read_text(encoding="utf-8"))
    for pack in manifest.get("packs", []):
        check_path(pack["path"], directory=True)

    url = f"https://github.com/{args.repo}"
    manifest.update(url=url, manifest=f"{url}/releases/latest/download/module.json",
                    download=f"{url}/releases/download/{tag}/module.zip")
    payload = (json.dumps(manifest, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    DIST.mkdir(exist_ok=True)
    with ZipFile(DIST / "module.zip", "w", ZIP_DEFLATED) as archive:
        archive.writestr("module.json", payload)
        for path in sorted(SOURCE.rglob("*")):
            if path.is_file() and path != SOURCE / "module.json":
                archive.write(path, path.relative_to(SOURCE))
    (DIST / "module.json").write_bytes(payload)
    print(f"Packaged {manifest['id']} {version} in {DIST}")


if __name__ == "__main__":
    main()
