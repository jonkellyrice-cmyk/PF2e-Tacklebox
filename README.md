# Forge Foundry Module Template

A small, build-free JavaScript starter for Pathfinder Second Edition worlds on Foundry VTT, including games hosted on The Forge. The starter registers one optional diagnostic setting. It does not modify actors, items, sheets, or world data during startup.

## Start a module

1. Use GitHub's **Use this template** if available, or copy the repository to a new project. A repository admin can enable **Template repository** in GitHub Settings → General.
2. Edit `module/module.json`. Choose a unique lowercase, hyphenated ID, title, description, author, and initial version. Replace `forge-foundry-module-template` in `module/scripts/main.mjs` and `module/lang/en.json` with the same ID. Keep the ID stable after release. Use a public repository for the documented one-click install flow.
3. The baseline targets Foundry 14 and PF2e 8. Confirm the exact versions you support in a test world before publishing. The system relationship makes PF2e the intended world system; the module does not create or switch worlds.
4. Develop in `module/`. Put JavaScript in `scripts/` and translations in `lang/`. Register additional entry points, languages, styles or compendium packs in the manifest when you add them. Everything in `module/` ships, so keep development files and private material outside that directory. For a content module, follow the PF2e pack guide below.
5. Choose a license and include it in the module directory before distributing your own work. Review permissions for third-party content separately.

## Run locally

Copy or symlink the **contents of the module directory as a folder named for the manifest ID** under Foundry's user data. For this starter the resulting path is `Data/modules/forge-foundry-module-template/module.json`. Restart Foundry, open a PF2e test world, enable the module in **Manage Modules**, and reload. Direct edits to a symlinked checkout appear after reload.

**Smoke test.** Open Configure Settings and find the module's diagnostic setting. Enable it, reload, and look for the module ID and PF2e version in the browser console. Disable it and reload to confirm quiet startup. Repeat as a player for any player-facing features you add. Local packaging checks do not run the Foundry client.

## Check and package

Use Python 3.10+ and Node.js 22+ from the repository root. No npm or pip install is required.

```sh
node --check module/scripts/main.mjs
python3 tools/package.py --repo OWNER/REPOSITORY
```

Replace `OWNER/REPOSITORY` with your GitHub path. The command validates the manifest, PF2e relationship and declared files, then creates `dist/module.json` and `dist/module.zip`. The ZIP has the manifest at its root. Its manifest matches the standalone copy. The packager fills in the repository URL, stable update manifest and version-specific download URL for the project being built. The source manifest is suitable for local development.

## Publish and install

Commit the module version you want to ship, then tag that commit with `v` plus its exact version (for example `v0.1.0`) and push the tag. The GitHub Actions workflow checks and packages every branch push and pull request. A matching version tag also creates a release with both assets. Enable GitHub Actions in derived repositories. Publishing uses the built-in GitHub token and requires the workflow's contents-write permission. Use a fresh version and tag for each release.

After the release is public, copy this URL **using your own owner and repository**:

```text
https://github.com/OWNER/REPOSITORY/releases/latest/download/module.json
```

- **The Forge:** Open the Bazaar's manifest installation option, paste the URL and install. Open your PF2e world and enable the package under Manage Modules.
- **Self-hosted Foundry:** In Setup → Add-on Modules → Install Module, paste the same manifest URL. Enable the module in the world.
- **Updates:** Publish a higher manifest version and use the host's package update control. If a fresh install fails, open the public manifest and its download URL signed out and check core/system versions. The latest URL starts working after the first release. Bazaar catalog listing is separate from manual manifest installation.

## References

- [Foundry module manifests and layout](https://foundryvtt.com/article/module-development/)
- [PF2e content modules and compendiums](https://github.com/foundryvtt/pf2e/wiki/Creating-a-PF2e-Content-Module)
- [The Forge Bazaar](https://forge-vtt.com/bazaar)
