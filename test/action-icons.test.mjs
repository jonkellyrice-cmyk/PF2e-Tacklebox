import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate as settled } from "node:timers/promises";
import { fit } from "../module/features/action-icons/thumbnail.mjs";
import { registerActionIcons } from "../module/features/action-icons/index.mjs";

test("square, near-square, landscape and portrait assets", () => {
  assert.deepEqual(fit(4096, 4096), [0, 0, 128, 128]);
  assert.deepEqual(fit(120, 100), [0, 0, 128, 128]);
  assert.deepEqual(fit(400, 100), [0, 48, 128, 32]);
  assert.deepEqual(fit(100, 400), [48, 0, 32, 128]);
  assert.throws(() => fit(0, 0));
});

test("sheet integration: select, rerender, cancel, permission checks and reset", async () => {
  let render, listener, callback, stored, choice = "browse", editable = true;
  const id = "pf2e-tacklebox";
  const image = { src: "pf2e-action.svg" };
  const item = {
    canUserModify: () => editable,
    getFlag: () => stored,
    setFlag: (scope, key, value) => {
      assert.deepEqual([scope, key], [id, "actionIcon"]);
      stored = value;
    },
    unsetFlag: () => { stored = undefined; },
  };
  const row = { dataset: { itemId: "feat-id" }, querySelector: () => image };
  const root = {
    querySelectorAll: () => [row],
    addEventListener: (_, fn) => { listener = fn; },
  };
  const sheet = { isEditable: true, actor: { type: "character", items: new Map([["feat-id", item]]) } };
  globalThis.Hooks = { on: (name, fn) => { assert.equal(name, "renderCharacterSheetPF2e"); render = fn; } };
  globalThis.game = { settings: { register() {}, get: () => true }, user: { can: () => true }, i18n: {localize: k => k} };
  globalThis.foundry = { applications: {
    api: { DialogV2: { wait: async () => choice } },
    apps: { FilePicker: { implementation: class {
      constructor(options) { callback = options.callback; assert.equal(options.type, "image"); }
      async browse() {}
    } } },
  } };
  globalThis.Image = class { naturalWidth = 1024; naturalHeight = 1024; async decode() {} };
  globalThis.document = { createElement: () => ({
    getContext: () => ({drawImage() {}}),
    toDataURL() { assert.equal(this.width, 128); assert.equal(this.height, 128); return "thumbnail"; },
  }) };
  registerActionIcons(id);
  render(sheet, {jquery: "3", 0: root});
  async function rightClick() {
    let handled = false;
    listener({target: {closest: s => s.startsWith(".actions-pane") ? row : null},
      preventDefault: () => { handled = true; }, stopPropagation() {}});
    await settled();
    return handled;
  }
  assert.ok(await rightClick());
  await callback("worlds/test/local-upload.png");
  assert.equal(stored, "thumbnail");
  render(sheet, root);
  assert.equal(image.src, "thumbnail");
  choice = "cancel";
  await rightClick();
  assert.equal(stored, "thumbnail");
  editable = false;
  assert.equal(await rightClick(), false);
  editable = true;
  choice = "reset";
  await rightClick();
  assert.equal(stored, undefined);
});
