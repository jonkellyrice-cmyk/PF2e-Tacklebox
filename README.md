# PF2e Tacklebox

Small, independent conveniences for Pathfinder Second Edition character sheets. Targets Foundry 14 and PF2e 8, including worlds hosted on The Forge.

## Custom action icons

1. Open your character's **Actions** tab. Right-click the name, icon, or row of an action such as High Jump or Lightning Swap.
2. Select **Browse / upload image** and choose from the sources visible to your account. To add your own file, navigate to a writable folder (such as your Forge Assets Library), use the picker's upload control and select the uploaded image. File browsing, uploading and shared-folder access follow the host's permissions.
3. The recommended artwork is **1:1 at 128 × 128 px**. Up to a 1.2:1 long-to-short-side ratio, Tacklebox stretches the image to square. More rectangular artwork receives transparent padding. Large images are resampled to 128 × 128. The original file stays in the library at its original resolution.
4. To undo, right-click the same row and select **Restore PF2e icon**. Owners and GMs can edit. Everyone viewing the sheet sees the saved thumbnail.

The feature covers item-backed action, reaction, free action, exploration and downtime rows, including feat-granted actions. Strikes, the inventory, chat, and hotbar macros keep their own artwork. The sheet uses a small thumbnail saved in a module flag on the owned item. Editing an icon does not change its action cost or the source compendium. An inaccessible image or a cross-origin server that disallows image processing leaves the previous icon in place.

The GM can switch **Custom action icons** off under Configure Settings → PF2e Tacklebox and reload. Turning it back on restores existing customizations.

## Install and develop

- **Released version:** In The Forge Bazaar's manifest installer or Foundry Setup → Add-on Modules → Install Module, paste the [release manifest](https://github.com/jonkellyrice-cmyk/PF2e-Tacklebox/releases/latest/download/module.json). This URL becomes available with the first tagged release. Enable PF2e Tacklebox under Manage Modules in the world.
- **Local build:** Copy `module/` to `Data/modules/pf2e-tacklebox/` so that `module.json` is directly inside that folder. Restart Foundry and enable the module.
- **Test and package:** Run `node --test` and `python3 tools/package.py --repo jonkellyrice-cmyk/PF2e-Tacklebox`. Outputs are `dist/module.zip` and `dist/module.json`.
- **Publish:** Push a tag matching the committed version, such as `v0.1.0`. GitHub Actions builds and attaches the ZIP and manifest to a release.

## Feature boundaries

Each feature lives in its own folder under `module/features/`, owns its settings, translations and hooks, and exposes a registration function. The entry point wires them together. Add localization files to the manifest as needed. Features do not import one another.

The sheet integration follows the [PF2e action row template](https://github.com/foundryvtt/pf2e/blob/pf2e-8.6.1/static/templates/actors/partials/action.hbs) and uses the host-configured [Foundry FilePicker](https://foundryvtt.com/api/v14/classes/foundry.applications.apps.FilePicker.html).
