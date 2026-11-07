import { registerActionIcons } from "../features/action-icons/index.mjs";

Hooks.once("init", () => registerActionIcons("pf2e-tacklebox"));
