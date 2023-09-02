

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.876d816e.js","_app/immutable/chunks/scheduler.42a9182f.js","_app/immutable/chunks/index.b9e5a421.js","_app/immutable/chunks/stores.639677c5.js","_app/immutable/chunks/singletons.3ad4075f.js","_app/immutable/chunks/index.e374f0f1.js"];
export const stylesheets = [];
export const fonts = [];
