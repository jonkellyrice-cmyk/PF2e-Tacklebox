const MODULE_ID = "forge-foundry-module-template";

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "debug", {
    name: `${MODULE_ID}.debug.name`,
    hint: `${MODULE_ID}.debug.hint`,
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });
});

Hooks.once("ready", () => {
  if (game.settings.get(MODULE_ID, "debug")) {
    console.info(`${MODULE_ID} | Ready on ${game.system.id} ${game.system.version}`);
  }
});
