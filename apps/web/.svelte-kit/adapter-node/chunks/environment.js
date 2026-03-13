let base = "";
let assets = base;
const app_dir = "_app";
const relative = true;
const initial = { base, assets };
function override(paths) {
  base = paths.base;
  assets = paths.assets;
}
function reset() {
  base = initial.base;
  assets = initial.assets;
}
function set_assets(path) {
  assets = initial.assets = path;
}
let public_env = {};
let fix_stack_trace = (error) => error?.stack;
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
let prerendering = false;
function set_building() {
}
function set_prerendering() {
  prerendering = true;
}
export {
  assets as a,
  base as b,
  app_dir as c,
  reset as d,
  set_public_env as e,
  set_assets as f,
  set_building as g,
  set_prerendering as h,
  prerendering as i,
  fix_stack_trace as j,
  override as o,
  public_env as p,
  relative as r,
  set_private_env as s
};
