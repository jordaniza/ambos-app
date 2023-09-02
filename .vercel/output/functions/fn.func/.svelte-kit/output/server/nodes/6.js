

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/profile/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.72b90a49.js","_app/immutable/chunks/scheduler.42a9182f.js","_app/immutable/chunks/index.b9e5a421.js","_app/immutable/chunks/separator.7c97f6ac.js","_app/immutable/chunks/index.e374f0f1.js","_app/immutable/chunks/contracts.065f76ae.js","_app/immutable/chunks/index.579d84c8.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/IconBase.22e63593.js","_app/immutable/chunks/card-content.cf287f12.js"];
export const stylesheets = ["_app/immutable/assets/IconBase.6bf551a2.css"];
export const fonts = [];
