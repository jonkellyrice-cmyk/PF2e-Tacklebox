import { thumbnail } from "./thumbnail.mjs";

const FLAG = "actionIcon";
const ROW = '.actions-pane li.action.item[data-item-id]';
const label = key => game.i18n.localize(`PF2eTacklebox.ActionIcons.${key}`);

export function registerActionIcons(moduleId) {
  game.settings.register(moduleId, "actionIcons", {
    name: "PF2eTacklebox.ActionIcons.setting",
    hint: "PF2eTacklebox.ActionIcons.hint",
    scope: "world", config: true, type: Boolean, default: true, requiresReload: true,
  });
  if (!game.settings.get(moduleId, "actionIcons")) return;

  const listeners = new WeakMap();
  Hooks.on("renderCharacterSheetPF2e", (sheet, html) => {
    const root = html.jquery ? html[0] : html;
    const actor = sheet.actor;
    if (actor?.type !== "character") return;
    for (const row of root.querySelectorAll(ROW)) {
      const icon = actor.items.get(row.dataset.itemId)?.getFlag(moduleId, FLAG);
      const image = row.querySelector(".item-image img");
      if (image && icon) image.src = icon;
    }

    listeners.get(root)?.abort();
    if (!sheet.isEditable) return;
    const controller = new AbortController();
    listeners.set(root, controller);
    root.addEventListener("contextmenu", event => {
      const row = event.target.closest?.(ROW);
      if (!row || event.target.closest("input, button, .item-controls, .item-summary")) return;
      const item = actor.items.get(row.dataset.itemId);
      if (!item?.canUserModify(game.user, "update")) return;
      event.preventDefault();
      event.stopPropagation();
      editIcon(moduleId, item).catch(reportError);
    }, { signal: controller.signal });
  });
}

function reportError(error) {
  console.error("PF2e Tacklebox | Action icon", error);
  ui.notifications.error(label("failed"));
}

async function editIcon(moduleId, item) {
  const buttons = [{ action: "browse", label: label("browse"), default: true }];
  if (item.getFlag(moduleId, FLAG)) buttons.push({ action: "reset", label: label("reset") });
  buttons.push({ action: "cancel", label: label("cancel") });
  const choice = await foundry.applications.api.DialogV2.wait({
    window: { title: label("title") },
    content: `<p>${label("instructions")}</p><p>${label("uploadHint")}</p>`,
    buttons, rejectClose: false,
  });
  if (choice === "reset") {
    if (item.canUserModify(game.user, "update")) await item.unsetFlag(moduleId, FLAG);
    return;
  }
  if (choice !== "browse") return;
  if (!game.user.can("FILES_BROWSE")) return ui.notifications.warn(label("browseDenied"));
  const Picker = foundry.applications.apps.FilePicker.implementation;
  const picker = new Picker({
    type: "image",
    callback: async path => {
      if (!path) return;
      try {
        const icon = await thumbnail(path);
        if (!item.canUserModify(game.user, "update")) return ui.notifications.warn(label("denied"));
        await item.setFlag(moduleId, FLAG, icon);
      } catch (error) {
        reportError(error);
      }
    },
  });
  await picker.browse();
}
