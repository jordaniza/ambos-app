import { a as set_current_component, n as noop, b as blank_object, r as run_all, d as children, e as detach, i as is_function, f as is_empty, g as current_component, h as run, j as start_hydrating, k as end_hydrating, c as create_ssr_component, v as validate_component, s as setContext, l as getContext, o as subscribe, p as onDestroy, q as compute_rest_props, t as spread, u as escape_object, w as safe_not_equal, x as ensure_array_like, y as create_slot, z as assign, A as svg_element, B as empty, C as claim_svg_element, D as set_svg_attributes, E as insert_hydration, F as append_hydration, G as update_slot_base, H as get_all_dirty_from_scope, I as get_slot_changes, J as destroy_each, K as exclude_internal_props, L as add_attribute, M as escape, N as each, O as createEventDispatcher, P as add_styles, Q as merge_ssr_styles, m as missing_component } from "../../chunks/ssr.js";
import { n as noop$1, i as isHTMLElement, u as useClickOutside, a as useEscapeKeydown, e as executeCallbacks, t as toWritableStores, b as builder, c as isBrowser, d as addMeltEventListener, f as createElHelpers, k as kbd, r as removeUndefined, g as getOptionUpdater, h as isBrowser$1, s as setTransitionTimes, j as cn, l as flyAndScale, B as Button, R as ROUTES, S as Separator, A as APP_NAME } from "../../chunks/separator.js";
import { I as IconBase } from "../../chunks/IconBase.js";
import "dequal";
import { d as derived, w as writable } from "../../chunks/index.js";
import { f as flush, a as add_render_callback, b as flush_render_callbacks, d as dirty_components, s as schedule_update, u as usePortal, c as createFocusTrap, o as overridable, g as generateId, e as styleToString, h as effect, t as tick, i as getPortalDestination, r as removeScroll, j as createDialog, k as createDispatcher, l as fade, m as fly, n as useEffect } from "../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import { tv } from "tailwind-variants";
import "clsx";
import { flip, offset, shift, arrow, size, autoUpdate, computePosition } from "@floating-ui/dom";
import { p as page } from "../../chunks/stores.js";
import { a as accountStore } from "../../chunks/index2.js";
import { ChainId } from "@biconomy/core-types";
import "../../chunks/index3.js";
import "../../chunks/contracts.js";
const outroing = /* @__PURE__ */ new Set();
let outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function get_spread_update(levels, updates) {
  const update = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update))
      update[key] = void 0;
  }
  return update;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function claim_component(block, parent_nodes) {
  block && block.l(parent_nodes);
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const app = "";
const FaWallet = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => {
      return `<path d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path>`;
    }
  })}`;
});
const FaMoneyBill = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 640 512" }, $$props), {}, {
    default: () => {
      return `<path d="M608 64H32C14.33 64 0 78.33 0 96v320c0 17.67 14.33 32 32 32h576c17.67 0 32-14.33 32-32V96c0-17.67-14.33-32-32-32zM48 400v-64c35.35 0 64 28.65 64 64H48zm0-224v-64h64c0 35.35-28.65 64-64 64zm272 176c-44.19 0-80-42.99-80-96 0-53.02 35.82-96 80-96s80 42.98 80 96c0 53.03-35.83 96-80 96zm272 48h-64c0-35.35 28.65-64 64-64v64zm0-224c-35.35 0-64-28.65-64-64h64v64z"></path>`;
    }
  })}`;
});
const FaChartLine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => {
      return `<path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"></path>`;
    }
  })}`;
});
const FaBars = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 448 512" }, $$props), {}, {
    default: () => {
      return `<path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>`;
    }
  })}`;
});
const FaUser = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 448 512" }, $$props), {}, {
    default: () => {
      return `<path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>`;
    }
  })}`;
});
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function derivedVisible(obj) {
  const { open, forceVisible, activeTrigger } = obj;
  return derived([open, forceVisible, activeTrigger], ([$open, $forceVisible, $activeTrigger]) => ($open || $forceVisible) && $activeTrigger !== null);
}
const defaultConfig$1 = {
  strategy: "absolute",
  placement: "top",
  gutter: 5,
  flip: true,
  sameWidth: false,
  overflowPadding: 8
};
const ARROW_TRANSFORM = {
  bottom: "rotate(45deg)",
  left: "rotate(135deg)",
  top: "rotate(225deg)",
  right: "rotate(315deg)"
};
function useFloating(reference, floating, opts = {}) {
  if (!floating || !reference)
    return {
      destroy: noop$1
    };
  const options = { ...defaultConfig$1, ...opts };
  const arrowEl = floating.querySelector("[data-arrow=true]");
  const middleware = [];
  if (options.flip) {
    middleware.push(flip({
      boundary: options.boundary,
      padding: options.overflowPadding
    }));
  }
  const arrowOffset = isHTMLElement(arrowEl) ? arrowEl.offsetHeight / 2 : 0;
  if (options.gutter || options.offset) {
    const data = options.gutter ? { mainAxis: options.gutter } : options.offset;
    if (data?.mainAxis != null) {
      data.mainAxis += arrowOffset;
    }
    middleware.push(offset(data));
  }
  middleware.push(shift({
    boundary: options.boundary,
    crossAxis: options.overlap,
    padding: options.overflowPadding
  }));
  if (arrowEl) {
    middleware.push(arrow({ element: arrowEl, padding: 8 }));
  }
  middleware.push(size({
    padding: options.overflowPadding,
    apply({ rects, availableHeight, availableWidth }) {
      if (options.sameWidth) {
        Object.assign(floating.style, {
          width: `${Math.round(rects.reference.width)}px`,
          minWidth: "unset"
        });
      }
      if (options.fitViewport) {
        Object.assign(floating.style, {
          maxWidth: `${availableWidth}px`,
          maxHeight: `${availableHeight}px`
        });
      }
    }
  }));
  function compute() {
    if (!reference || !floating)
      return;
    const { placement, strategy } = options;
    computePosition(reference, floating, {
      placement,
      middleware,
      strategy
    }).then((data) => {
      const x = Math.round(data.x);
      const y = Math.round(data.y);
      Object.assign(floating.style, {
        top: `${y}px`,
        left: `${x}px`
      });
      if (isHTMLElement(arrowEl) && data.middlewareData.arrow) {
        const { x: x2, y: y2 } = data.middlewareData.arrow;
        const dir = data.placement.split("-")[0];
        Object.assign(arrowEl.style, {
          position: "absolute",
          left: x2 != null ? `${x2}px` : "",
          top: y2 != null ? `${y2}px` : "",
          [dir]: `calc(100% - ${arrowOffset}px)`,
          transform: ARROW_TRANSFORM[dir],
          backgroundColor: "inherit",
          zIndex: "inherit"
        });
      }
      return data;
    });
  }
  Object.assign(floating.style, {
    position: options.strategy
  });
  return {
    destroy: autoUpdate(reference, floating, compute)
  };
}
const defaultConfig = {
  floating: {},
  focusTrap: {},
  clickOutside: {},
  escapeKeydown: {},
  portal: "body"
};
const usePopper = (popperElement, args) => {
  popperElement.dataset.escapee = "";
  const { anchorElement, open, options } = args;
  if (!anchorElement || !open || !options) {
    return { destroy: noop$1 };
  }
  const opts = { ...defaultConfig, ...options };
  const callbacks = [];
  if (opts.portal !== null) {
    const portal = usePortal(popperElement, opts.portal);
    if (portal?.destroy) {
      callbacks.push(portal.destroy);
    }
  }
  callbacks.push(useFloating(anchorElement, popperElement, opts.floating).destroy);
  if (opts.focusTrap !== null) {
    const { useFocusTrap } = createFocusTrap({
      immediate: true,
      escapeDeactivates: false,
      allowOutsideClick: true,
      returnFocusOnDeactivate: false,
      fallbackFocus: popperElement,
      ...opts.focusTrap
    });
    const usedFocusTrap = useFocusTrap(popperElement);
    if (usedFocusTrap?.destroy) {
      callbacks.push(usedFocusTrap.destroy);
    }
  }
  if (opts.clickOutside !== null) {
    callbacks.push(useClickOutside(popperElement, {
      enabled: open,
      handler: (e) => {
        if (e.defaultPrevented)
          return;
        if (isHTMLElement(anchorElement) && !anchorElement.contains(e.target)) {
          open.set(false);
          anchorElement.focus();
        }
      },
      ...opts.clickOutside
    }).destroy);
  }
  if (opts.escapeKeydown !== null) {
    callbacks.push(useEscapeKeydown(popperElement, {
      enabled: open,
      handler: (e) => {
        if (e.defaultPrevented)
          return;
        open.set(false);
      },
      ...opts.escapeKeydown
    }).destroy);
  }
  const unsubscribe = executeCallbacks(...callbacks);
  return {
    destroy() {
      unsubscribe();
    }
  };
};
const defaults = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  defaultOpen: false,
  disableFocusTrap: false,
  closeOnEscape: true,
  preventScroll: false,
  onOpenChange: void 0,
  closeOnOutsideClick: true,
  portal: void 0,
  forceVisible: false
};
const { name } = createElHelpers("popover");
function createPopover(args) {
  const withDefaults = { ...defaults, ...args };
  const options = toWritableStores(omit(withDefaults, "open"));
  const { positioning, arrowSize, disableFocusTrap, preventScroll, closeOnEscape, closeOnOutsideClick, portal, forceVisible } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const activeTrigger = writable(null);
  const ids = {
    content: generateId(),
    trigger: generateId()
  };
  function handleClose() {
    open.set(false);
    const triggerEl = document.getElementById(ids.trigger);
    if (triggerEl) {
      tick().then(() => {
        triggerEl.focus();
      });
    }
  }
  const isVisible = derivedVisible({ open, activeTrigger, forceVisible });
  const content = builder(name("content"), {
    stores: [isVisible, portal],
    returned: ([$isVisible, $portal]) => {
      return {
        hidden: $isVisible && isBrowser ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        id: ids.content,
        "data-state": $isVisible ? "open" : "closed",
        "data-portal": $portal ? "" : void 0
      };
    },
    action: (node) => {
      let unsubPopper = noop$1;
      const unsubDerived = effect([
        isVisible,
        activeTrigger,
        positioning,
        disableFocusTrap,
        closeOnEscape,
        closeOnOutsideClick,
        portal
      ], ([$isVisible, $activeTrigger, $positioning, $disableFocusTrap, $closeOnEscape, $closeOnOutsideClick, $portal]) => {
        unsubPopper();
        if (!$isVisible || !$activeTrigger)
          return;
        tick().then(() => {
          const popper = usePopper(node, {
            anchorElement: $activeTrigger,
            open,
            options: {
              floating: $positioning,
              focusTrap: $disableFocusTrap ? null : void 0,
              clickOutside: $closeOnOutsideClick ? void 0 : null,
              escapeKeydown: $closeOnEscape ? {
                handler: () => {
                  handleClose();
                }
              } : null,
              portal: getPortalDestination(node, $portal)
            }
          });
          if (popper && popper.destroy) {
            unsubPopper = popper.destroy;
          }
        });
      });
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
        }
      };
    }
  });
  function toggleOpen() {
    open.update((prev) => !prev);
  }
  const trigger = builder(name("trigger"), {
    stores: open,
    returned: ($open) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        "data-state": $open ? "open" : "closed",
        "aria-controls": ids.content,
        id: ids.trigger
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        activeTrigger.set(node);
        toggleOpen();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        activeTrigger.set(node);
        toggleOpen();
      }));
      return {
        destroy: unsub
      };
    }
  });
  const arrow2 = builder(name("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  const close = builder(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleOpen();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
    if (!isBrowser)
      return;
    const unsubs = [];
    if ($open) {
      if (!$activeTrigger) {
        tick().then(() => {
          const triggerEl = document.getElementById(ids.trigger);
          if (!isHTMLElement(triggerEl))
            return;
          activeTrigger.set(triggerEl);
        });
      }
      if ($preventScroll) {
        unsubs.push(removeScroll());
      }
    }
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  return {
    elements: {
      trigger,
      content,
      arrow: arrow2,
      close
    },
    states: {
      open
    },
    options
  };
}
const NAME$1 = "Dialog";
const ctx$1 = {
  set: set$1,
  get: get$1
};
function set$1(props) {
  const dialog = createDialog({ ...removeUndefined(props), role: "dialog" });
  setContext(NAME$1, {
    ...dialog,
    transitionTimes: props.transitionTimes,
    tOpen: props.tOpen
  });
  return {
    ...dialog,
    updateOption: getOptionUpdater(dialog.options)
  };
}
function get$1() {
  return getContext(NAME$1);
}
const Dialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transitionTimes, $$unsubscribe_transitionTimes;
  let $tOpen, $$unsubscribe_tOpen;
  let { preventScroll = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { forceVisible = true } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  const transitionTimes = writable({});
  $$unsubscribe_transitionTimes = subscribe(transitionTimes, (value) => $transitionTimes = value);
  const tOpen = writable(open);
  $$unsubscribe_tOpen = subscribe(tOpen, (value) => $tOpen = value);
  let timeout = 0;
  const { states: { open: localOpen }, updateOption } = ctx$1.set({
    closeOnEscape,
    preventScroll,
    closeOnOutsideClick,
    portal,
    forceVisible,
    defaultOpen: open,
    transitionTimes,
    tOpen,
    onOpenChange: ({ next }) => {
      if (!isBrowser$1) {
        return next;
      }
      window.clearTimeout(timeout);
      if (open !== next) {
        onOpenChange?.(next);
      }
      if (next !== $tOpen) {
        tOpen.set(next);
        if (!next) {
          timeout = window.setTimeout(
            () => {
              localOpen.set(next);
            },
            $transitionTimes.out ? $transitionTimes.out * 0.6 : 0
          );
          open = !next;
          return !next;
        } else {
          open = next;
          return next;
        }
      }
      open = next;
      return next;
    }
  });
  onDestroy(() => {
    if (isBrowser$1) {
      window.clearTimeout(timeout);
    }
  });
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.forceVisible === void 0 && $$bindings.forceVisible && forceVisible !== void 0)
    $$bindings.forceVisible(forceVisible);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("forceVisible", forceVisible);
  }
  $$unsubscribe_transitionTimes();
  $$unsubscribe_tOpen();
  return `${slots.default ? slots.default({}) : ``}`;
});
const DialogClose = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild"]);
  let $close, $$unsubscribe_close;
  let { asChild = false } = $$props;
  const { elements: { close } } = ctx$1.get();
  $$unsubscribe_close = subscribe(close, (value) => $close = value);
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_close();
  return `${asChild ? `${slots.default ? slots.default({ builder: $close }) : ``}` : (() => {
    let builder2 = $close;
    return ` <button${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`;
  })()}`;
});
const DialogPortal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild"]);
  let $portalled, $$unsubscribe_portalled;
  let { asChild = false } = $$props;
  const { elements: { portalled }, states: { open } } = ctx$1.get();
  $$unsubscribe_portalled = subscribe(portalled, (value) => $portalled = value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_portalled();
  return `${asChild ? (() => {
    let builder2 = $portalled;
    return ` ${slots.default ? slots.default({ builder: builder2 }) : ``}`;
  })() : (() => {
    let builder2 = $portalled;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })()}`;
});
const DialogContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild"
  ]);
  let $tOpen, $$unsubscribe_tOpen;
  let $content, $$unsubscribe_content;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  const { elements: { content }, transitionTimes, tOpen } = ctx$1.get();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_tOpen = subscribe(tOpen, (value) => $tOpen = value);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  {
    setTransitionTimes(transitionTimes, {
      transition,
      transitionConfig,
      inTransition,
      inTransitionConfig,
      outTransition,
      outTransitionConfig
    });
  }
  $$unsubscribe_tOpen();
  $$unsubscribe_content();
  return `${asChild && $tOpen ? (() => {
    let builder2 = $content;
    return ` ${slots.default ? slots.default({ builder: builder2 }) : ``}`;
  })() : `${transition && $tOpen ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${inTransition && outTransition && $tOpen ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${inTransition && $tOpen ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${outTransition && $tOpen ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${$tOpen ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : ``}`}`}`}`}`}`;
});
const DialogOverlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild"
  ]);
  let $tOpen, $$unsubscribe_tOpen;
  let $overlay, $$unsubscribe_overlay;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  const { elements: { overlay }, tOpen } = ctx$1.get();
  $$unsubscribe_overlay = subscribe(overlay, (value) => $overlay = value);
  $$unsubscribe_tOpen = subscribe(tOpen, (value) => $tOpen = value);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_tOpen();
  $$unsubscribe_overlay();
  return `${asChild && $tOpen ? (() => {
    let builder2 = $overlay;
    return ` ${slots.default ? slots.default({ builder: builder2 }) : ``}`;
  })() : `${transition && $tOpen ? (() => {
    let builder2 = $overlay;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}></div>`;
  })() : `${inTransition && outTransition && $tOpen ? (() => {
    let builder2 = $overlay;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}></div>`;
  })() : `${inTransition && $tOpen ? (() => {
    let builder2 = $overlay;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}></div>`;
  })() : `${outTransition && $tOpen ? (() => {
    let builder2 = $overlay;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}></div>`;
  })() : `${$tOpen ? (() => {
    let builder2 = $overlay;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}></div>`;
  })() : ``}`}`}`}`}`}`;
});
const DialogTrigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  const { elements: { trigger } } = ctx$1.get();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: $trigger }) : ``}` : (() => {
    let builder2 = $trigger;
    return ` <button${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`;
  })()}`;
});
const NAME = "Popover";
const ctx = {
  set,
  get,
  setArrow
};
function set(props) {
  const popover = createPopover({
    ...removeUndefined(props),
    forceVisible: true
  });
  setContext(NAME, popover);
  return {
    ...popover,
    updateOption: getOptionUpdater(popover.options)
  };
}
function get() {
  return getContext(NAME);
}
function setArrow(size2 = 8) {
  const popover = get();
  popover.options.arrowSize.set(size2);
  return popover;
}
const Popover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { positioning = void 0 } = $$props;
  let { arrowSize = void 0 } = $$props;
  let { disableFocusTrap = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  const { updateOption, states: { open: localOpen } } = ctx.set({
    positioning,
    arrowSize,
    disableFocusTrap,
    closeOnEscape,
    closeOnOutsideClick,
    preventScroll,
    portal,
    defaultOpen: open,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  if ($$props.positioning === void 0 && $$bindings.positioning && positioning !== void 0)
    $$bindings.positioning(positioning);
  if ($$props.arrowSize === void 0 && $$bindings.arrowSize && arrowSize !== void 0)
    $$bindings.arrowSize(arrowSize);
  if ($$props.disableFocusTrap === void 0 && $$bindings.disableFocusTrap && disableFocusTrap !== void 0)
    $$bindings.disableFocusTrap(disableFocusTrap);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0)
    $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0)
    $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0)
    $$bindings.preventScroll(preventScroll);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0)
    $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0)
    $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0)
    $$bindings.onOpenChange(onOpenChange);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("positioning", positioning);
  }
  {
    updateOption("arrowSize", arrowSize);
  }
  {
    updateOption("disableFocusTrap", disableFocusTrap);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("portal", portal);
  }
  return `${slots.default ? slots.default({}) : ``}`;
});
const PopoverContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild"
  ]);
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  const { elements: { content }, states: { open } } = ctx.get();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0)
    $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0)
    $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0)
    $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0)
    $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_open();
  $$unsubscribe_content();
  return `${asChild && $open ? (() => {
    let builder2 = $content;
    return ` ${slots.default ? slots.default({ builder: builder2 }) : ``}`;
  })() : `${transition && $open ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${inTransition && outTransition && $open ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${inTransition && $open ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${outTransition && $open ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : `${$open ? (() => {
    let builder2 = $content;
    return ` <div${spread([escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</div>`;
  })() : ``}`}`}`}`}`}`;
});
const PopoverTrigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild"]);
  let $trigger, $$unsubscribe_trigger;
  let { asChild = false } = $$props;
  const { elements: { trigger } } = ctx.get();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder: $trigger }) : ``}` : (() => {
    let builder2 = $trigger;
    return ` <button${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</button>`;
  })()}`;
});
const Sheet_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(DialogPortal, "SheetPrimitive.Portal").$$render($$result, Object.assign({}, { class: cn(className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Sheet_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = fade } = $$props;
  let { transitionConfig = { duration: 150 } } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(DialogOverlay, "SheetPrimitive.Overlay").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm ", className)
      },
      $$restProps
    ),
    {},
    {}
  )}`;
});
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function get_each_context(ctx2, list, i) {
  const child_ctx = ctx2.slice();
  child_ctx[10] = list[i][0];
  child_ctx[11] = list[i][1];
  return child_ctx;
}
function create_dynamic_element(ctx2) {
  let svelte_element;
  let svelte_element_levels = [
    /*attrs*/
    ctx2[11]
  ];
  let svelte_element_data = {};
  for (let i = 0; i < svelte_element_levels.length; i += 1) {
    svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
  }
  return {
    c() {
      svelte_element = svg_element(
        /*tag*/
        ctx2[10]
      );
      this.h();
    },
    l(nodes) {
      svelte_element = claim_svg_element(
        nodes,
        /*tag*/
        ctx2[10],
        {}
      );
      children(svelte_element).forEach(detach);
      this.h();
    },
    h() {
      set_svg_attributes(svelte_element, svelte_element_data);
    },
    m(target, anchor) {
      insert_hydration(target, svelte_element, anchor);
    },
    p(ctx3, dirty) {
      set_svg_attributes(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [dirty & /*iconNode*/
      32 && /*attrs*/
      ctx3[11]]));
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element);
      }
    }
  };
}
function create_each_block(ctx2) {
  let previous_tag = (
    /*tag*/
    ctx2[10]
  );
  let svelte_element_anchor;
  let svelte_element = (
    /*tag*/
    ctx2[10] && create_dynamic_element(ctx2)
  );
  return {
    c() {
      if (svelte_element)
        svelte_element.c();
      svelte_element_anchor = empty();
    },
    l(nodes) {
      if (svelte_element)
        svelte_element.l(nodes);
      svelte_element_anchor = empty();
    },
    m(target, anchor) {
      if (svelte_element)
        svelte_element.m(target, anchor);
      insert_hydration(target, svelte_element_anchor, anchor);
    },
    p(ctx3, dirty) {
      if (
        /*tag*/
        ctx3[10]
      ) {
        if (!previous_tag) {
          svelte_element = create_dynamic_element(ctx3);
          previous_tag = /*tag*/
          ctx3[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else if (safe_not_equal(
          previous_tag,
          /*tag*/
          ctx3[10]
        )) {
          svelte_element.d(1);
          svelte_element = create_dynamic_element(ctx3);
          previous_tag = /*tag*/
          ctx3[10];
          svelte_element.c();
          svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
        } else {
          svelte_element.p(ctx3, dirty);
        }
      } else if (previous_tag) {
        svelte_element.d(1);
        svelte_element = null;
        previous_tag = /*tag*/
        ctx3[10];
      }
    },
    d(detaching) {
      if (detaching) {
        detach(svelte_element_anchor);
      }
      if (svelte_element)
        svelte_element.d(detaching);
    }
  };
}
function create_fragment$1(ctx2) {
  let svg;
  let each_1_anchor;
  let svg_stroke_width_value;
  let svg_class_value;
  let current;
  let each_value = ensure_array_like(
    /*iconNode*/
    ctx2[5]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx2, each_value, i));
  }
  const default_slot_template = (
    /*#slots*/
    ctx2[9].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx2,
    /*$$scope*/
    ctx2[8],
    null
  );
  let svg_levels = [
    defaultAttributes,
    /*$$restProps*/
    ctx2[6],
    { width: (
      /*size*/
      ctx2[2]
    ) },
    { height: (
      /*size*/
      ctx2[2]
    ) },
    { stroke: (
      /*color*/
      ctx2[1]
    ) },
    {
      "stroke-width": svg_stroke_width_value = /*absoluteStrokeWidth*/
      ctx2[4] ? Number(
        /*strokeWidth*/
        ctx2[3]
      ) * 24 / Number(
        /*size*/
        ctx2[2]
      ) : (
        /*strokeWidth*/
        ctx2[3]
      )
    },
    {
      class: svg_class_value = `lucide-icon lucide lucide-${/*name*/
      ctx2[0]} ${/*$$props*/
      ctx2[7].class ?? ""}`
    }
  ];
  let svg_data = {};
  for (let i = 0; i < svg_levels.length; i += 1) {
    svg_data = assign(svg_data, svg_levels[i]);
  }
  return {
    c() {
      svg = svg_element("svg");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.c();
      this.h();
    },
    l(nodes) {
      svg = claim_svg_element(nodes, "svg", {
        width: true,
        height: true,
        stroke: true,
        "stroke-width": true,
        class: true
      });
      var svg_nodes = children(svg);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(svg_nodes);
      }
      each_1_anchor = empty();
      if (default_slot)
        default_slot.l(svg_nodes);
      svg_nodes.forEach(detach);
      this.h();
    },
    h() {
      set_svg_attributes(svg, svg_data);
    },
    m(target, anchor) {
      insert_hydration(target, svg, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(svg, null);
        }
      }
      append_hydration(svg, each_1_anchor);
      if (default_slot) {
        default_slot.m(svg, null);
      }
      current = true;
    },
    p(ctx3, [dirty]) {
      if (dirty & /*iconNode*/
      32) {
        each_value = ensure_array_like(
          /*iconNode*/
          ctx3[5]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx3, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(svg, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        256)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx3,
            /*$$scope*/
            ctx3[8],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx3[8]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx3[8],
              dirty,
              null
            ),
            null
          );
        }
      }
      set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
        defaultAttributes,
        dirty & /*$$restProps*/
        64 && /*$$restProps*/
        ctx3[6],
        (!current || dirty & /*size*/
        4) && { width: (
          /*size*/
          ctx3[2]
        ) },
        (!current || dirty & /*size*/
        4) && { height: (
          /*size*/
          ctx3[2]
        ) },
        (!current || dirty & /*color*/
        2) && { stroke: (
          /*color*/
          ctx3[1]
        ) },
        (!current || dirty & /*absoluteStrokeWidth, strokeWidth, size*/
        28 && svg_stroke_width_value !== (svg_stroke_width_value = /*absoluteStrokeWidth*/
        ctx3[4] ? Number(
          /*strokeWidth*/
          ctx3[3]
        ) * 24 / Number(
          /*size*/
          ctx3[2]
        ) : (
          /*strokeWidth*/
          ctx3[3]
        ))) && { "stroke-width": svg_stroke_width_value },
        (!current || dirty & /*name, $$props*/
        129 && svg_class_value !== (svg_class_value = `lucide-icon lucide lucide-${/*name*/
        ctx3[0]} ${/*$$props*/
        ctx3[7].class ?? ""}`)) && { class: svg_class_value }
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
      destroy_each(each_blocks, detaching);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  const omit_props_names = ["name", "color", "size", "strokeWidth", "absoluteStrokeWidth", "iconNode"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { name: name2 } = $$props;
  let { color = "currentColor" } = $$props;
  let { size: size2 = 24 } = $$props;
  let { strokeWidth = 2 } = $$props;
  let { absoluteStrokeWidth = false } = $$props;
  let { iconNode } = $$props;
  $$self.$$set = ($$new_props) => {
    $$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("name" in $$new_props)
      $$invalidate(0, name2 = $$new_props.name);
    if ("color" in $$new_props)
      $$invalidate(1, color = $$new_props.color);
    if ("size" in $$new_props)
      $$invalidate(2, size2 = $$new_props.size);
    if ("strokeWidth" in $$new_props)
      $$invalidate(3, strokeWidth = $$new_props.strokeWidth);
    if ("absoluteStrokeWidth" in $$new_props)
      $$invalidate(4, absoluteStrokeWidth = $$new_props.absoluteStrokeWidth);
    if ("iconNode" in $$new_props)
      $$invalidate(5, iconNode = $$new_props.iconNode);
    if ("$$scope" in $$new_props)
      $$invalidate(8, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [
    name2,
    color,
    size2,
    strokeWidth,
    absoluteStrokeWidth,
    iconNode,
    $$restProps,
    $$props,
    $$scope,
    slots
  ];
}
let Icon$1 = class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      name: 0,
      color: 1,
      size: 2,
      strokeWidth: 3,
      absoluteStrokeWidth: 4,
      iconNode: 5
    });
  }
};
var Icon$1$1 = Icon$1;
function create_default_slot(ctx2) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx2[2].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx2,
    /*$$scope*/
    ctx2[3],
    null
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    l(nodes) {
      if (default_slot)
        default_slot.l(nodes);
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx3, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        8)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx3,
            /*$$scope*/
            ctx3[3],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx3[3]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx3[3],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment(ctx2) {
  let icon;
  let current;
  const icon_spread_levels = [
    { name: "x" },
    /*$$props*/
    ctx2[1],
    { iconNode: (
      /*iconNode*/
      ctx2[0]
    ) }
  ];
  let icon_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx: ctx2 }
  };
  for (let i = 0; i < icon_spread_levels.length; i += 1) {
    icon_props = assign(icon_props, icon_spread_levels[i]);
  }
  icon = new Icon$1$1({ props: icon_props });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    l(nodes) {
      claim_component(icon.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx3, [dirty]) {
      const icon_changes = dirty & /*$$props, iconNode*/
      3 ? get_spread_update(icon_spread_levels, [
        icon_spread_levels[0],
        dirty & /*$$props*/
        2 && get_spread_object(
          /*$$props*/
          ctx3[1]
        ),
        dirty & /*iconNode*/
        1 && { iconNode: (
          /*iconNode*/
          ctx3[0]
        ) }
      ]) : {};
      if (dirty & /*$$scope*/
      8) {
        icon_changes.$$scope = { dirty, ctx: ctx3 };
      }
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  const iconNode = [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]];
  $$self.$$set = ($$new_props) => {
    $$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$props = exclude_internal_props($$props);
  return [iconNode, $$props, slots, $$scope];
}
class X extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
var X$1 = X;
const Sheet_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "side", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { side = "right" } = $$props;
  let { transition = fly } = $$props;
  let { transitionConfig = sheetTransitions[side ? side : "right"] } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0)
    $$bindings.side(side);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(Sheet_portal, "SheetPortal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Sheet_overlay, "SheetOverlay").$$render($$result, {}, {}, {})} ${validate_component(DialogContent, "SheetPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          { transition },
          { transitionConfig },
          {
            class: cn(sheetVariants({ side }), className)
          },
          $$restProps
        ),
        {},
        {
          default: () => {
            return `${slots.default ? slots.default({}) : ``} ${validate_component(DialogClose, "SheetPrimitive.Close").$$render(
              $$result,
              {
                class: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
              },
              {},
              {
                default: () => {
                  return `${validate_component(X$1, "X").$$render($$result, { class: "h-4 w-4" }, {}, {})} <span class="sr-only" data-svelte-h="svelte-1pewzs3">Close</span>`;
                }
              }
            )}`;
          }
        }
      )}`;
    }
  })}`;
});
const Root$1 = Dialog;
const Close = DialogClose;
const Trigger$1 = DialogTrigger;
const sheetVariants = tv({
  base: "fixed z-50 gap-4 bg-background p-6 shadow-lg",
  variants: {
    side: {
      top: "inset-x-0 top-0 border-b",
      bottom: "inset-x-0 bottom-0 border-t",
      left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
      right: "inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm"
    }
  },
  defaultVariants: {
    side: "right"
  }
});
const sheetTransitions = {
  top: {
    y: "-100%",
    duration: 500,
    opacity: 1
  },
  bottom: {
    y: "100%",
    duration: 500,
    opacity: 1
  },
  left: {
    x: "-100%",
    duration: 500,
    opacity: 1
  },
  right: {
    x: "100%",
    duration: 500,
    opacity: 1
  }
};
const Popover_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "transition", "transitionConfig"]);
  let { class: className = void 0 } = $$props;
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  return `${validate_component(PopoverContent, "PopoverPrimitive.Content").$$render(
    $$result,
    Object.assign(
      {},
      { transition },
      { transitionConfig },
      {
        class: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)
      },
      $$restProps
    ),
    {},
    {
      default: () => {
        return `${slots.default ? slots.default({}) : ``}`;
      }
    }
  )}`;
});
const Root = Popover;
const Trigger = PopoverTrigger;
const AvatarPopover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Root, "Popover").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Trigger, "PopoverTrigger").$$render($$result, { asChild: true }, {}, {
        default: ({ builder: builder2 }) => {
          return `${validate_component(Button, "Button").$$render(
            $$result,
            {
              variant: "outline",
              class: "rounded-full",
              builders: [builder2]
            },
            {},
            {
              default: () => {
                return `JA`;
              }
            }
          )}`;
        }
      })} ${validate_component(Popover_content, "PopoverContent").$$render($$result, { class: "w-40" }, {}, {
        default: () => {
          return `<div class="grid gap-4"><div class="space-y-2" data-svelte-h="svelte-1ghrs7j"><h4 class="font-medium leading-none">Status</h4> <p class="text-sm text-muted-foreground">Connected</p></div> ${validate_component(Button, "Button").$$render($$result, { variant: "secondary", class: "w-full" }, {}, {
            default: () => {
              return `<a${add_attribute("href", ROUTES.PROFILE, 0)} class="w-full" data-svelte-h="svelte-xc90pw">My Profile</a>`;
            }
          })}</div>`;
        }
      })}`;
    }
  })}`;
});
const Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let address;
  let selected;
  let $page, $$unsubscribe_page;
  let $accountStore, $$unsubscribe_accountStore;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_accountStore = subscribe(accountStore, (value) => $accountStore = value);
  ChainId.POLYGON_MUMBAI;
  address = $accountStore?.address;
  selected = $page.url.pathname;
  $$unsubscribe_page();
  $$unsubscribe_accountStore();
  return `<div class="flex items-center justify-between p-4 backdrop-blur"><div class="flex items-center">${validate_component(Root$1, "Sheet").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Trigger$1, "SheetTrigger").$$render($$result, { asChild: true }, {}, {
        default: ({ builder: builder2 }) => {
          return `${validate_component(Button, "Button").$$render($$result, { builders: [builder2], variant: "ghost" }, {}, {
            default: () => {
              return `${validate_component(FaBars, "HamburgerMenuIcon").$$render($$result, { class: "h-6 w-6 my-10" }, {}, {})}`;
            }
          })}`;
        }
      })} ${validate_component(Sheet_content, "SheetContent").$$render(
        $$result,
        {
          side: "left",
          class: "flex flex-col justify-between"
        },
        {},
        {
          default: () => {
            return `<ul class="flex flex-col my-5">${validate_component(Close, "SheetClose").$$render($$result, { asChild: true }, {}, {
              default: ({ builder: builder2 }) => {
                return `<li class="my-3 ml-2 flex">${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    variant: "ghost",
                    class: "flex items-center w-full text-xl justify-start",
                    builders: [builder2]
                  },
                  {},
                  {
                    default: () => {
                      return `<div class="h-8 w-8 mr-2 mt-1">${validate_component(FaChartLine, "DashboardIcon").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <a${add_attribute("href", ROUTES.DASHBOARD, 0)}${add_attribute("class", `ml-2 text-md ${selected === ROUTES.DASHBOARD ? "underline" : ""} `, 0)}>Dashboard</a>`;
                    }
                  }
                )}</li>`;
              }
            })} ${validate_component(Close, "SheetClose").$$render($$result, { asChild: true }, {}, {
              default: ({ builder: builder2 }) => {
                return `<li class="my-3 ml-2 flex">${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    variant: "ghost",
                    class: "flex items-center w-full text-xl justify-start",
                    builders: [builder2]
                  },
                  {},
                  {
                    default: () => {
                      return `<div class="h-8 w-8 mr-2 mt-1">${validate_component(FaMoneyBill, "LoansIcon").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <a${add_attribute("href", ROUTES.MY_LOANS, 0)}${add_attribute("class", `ml-2 text-md ${selected === ROUTES.MY_LOANS ? "underline" : ""} `, 0)}>My Loans</a>`;
                    }
                  }
                )}</li>`;
              }
            })} ${validate_component(Close, "SheetClose").$$render($$result, { asChild: true }, {}, {
              default: ({ builder: builder2 }) => {
                return `<li class="my-3 ml-2 flex">${validate_component(Button, "Button").$$render(
                  $$result,
                  {
                    variant: "ghost",
                    class: "flex items-center w-full text-xl justify-start",
                    builders: [builder2]
                  },
                  {},
                  {
                    default: () => {
                      return `<div class="h-6 w-8 mr-2">${validate_component(FaWallet, "WalletIcon").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <a${add_attribute("href", ROUTES.WALLET, 0)}${add_attribute("class", `ml-2 text-md bold ${selected === ROUTES.WALLET ? "underline" : ""} `, 0)}>Wallet</a>`;
                    }
                  }
                )}</li>`;
              }
            })}</ul> <section class="flex flex-col">${validate_component(Separator, "Separator").$$render($$result, { class: "my-5" }, {}, {})} <div class="flex justify-between w-full items-center">${validate_component(Button, "Button").$$render(
              $$result,
              {
                variant: "ghost",
                class: "text-xl w-full text-center"
              },
              {},
              {
                default: () => {
                  return `Logout`;
                }
              }
            )}</div></section>`;
          }
        }
      )}`;
    }
  })}</div> <h1>${escape(APP_NAME)}</h1> <div class="flex items-center">${address ? `${validate_component(AvatarPopover, "AvatarPopover").$$render($$result, {}, {}, {})}` : `${validate_component(Button, "Button").$$render($$result, { variant: "ghost", class: "rounded-full" }, {}, {
    default: () => {
      return `${validate_component(FaUser, "ProfileIcon").$$render($$result, { class: "h-6 w-6" }, {}, {})}`;
    }
  })}`}</div></div>`;
});
const Loader = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { visible } = $$props;
  const bars = Array(12).fill(0);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  return `<div class="sonner-loading-wrapper"${add_attribute("data-visible", visible, 0)}><div class="sonner-spinner">${each(bars, (_bar, i) => {
    return `<div class="sonner-loading-bar"></div>`;
  })}</div></div>`;
});
const Icon2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type = "success" } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  return `${type === "success" ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"></path></svg>` : `${type === "error" ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>` : `${type === "info" ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"></path></svg>` : `${type === "warning" ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" height="20" width="20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>` : ``}`}`}`}`;
});
const TOAST_LIFETIME = 4e3;
const GAP$1 = 14;
const TIME_BEFORE_UNMOUNT = 200;
const Toast$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isFront;
  let isVisible;
  let toastType;
  let toastClass;
  let toastDescriptionClass;
  let heightIndex;
  let coords;
  let toastsHeightBefore;
  let disabled;
  let isPromiseLoadingOrInfiniteDuration;
  let $$unsubscribe_effect = noop, $$subscribe_effect = () => ($$unsubscribe_effect(), $$unsubscribe_effect = subscribe(effect2, ($$value) => $$value), effect2);
  let { toast } = $$props;
  let { toasts } = $$props;
  let { index } = $$props;
  let { expanded } = $$props;
  let { invert } = $$props;
  let { heights } = $$props;
  let { position } = $$props;
  let { visibleToasts } = $$props;
  let { expandByDefault } = $$props;
  let { closeButton } = $$props;
  let { interacting } = $$props;
  let { duration } = $$props;
  let { descriptionClass = "" } = $$props;
  let mounted = false;
  let removed = false;
  let swiping = false;
  let swipeOut = false;
  let offsetBeforeRemove = 0;
  let initialHeight = 0;
  let toastRef;
  let offset2 = 0;
  let closeTimerStartTimeRef = 0;
  let closeTimerRemainingTimeRef = toast.duration || duration || TOAST_LIFETIME;
  let lastCloseTimerStartTimeRef = 0;
  const dispatch = createEventDispatcher();
  const deleteToast = () => {
    removed = true;
    offsetBeforeRemove = offset2;
    dispatch("setHeights", heights.filter((height) => height.toastId !== toast.id));
    setTimeout(
      () => {
        dispatch("removeToast", toast);
      },
      TIME_BEFORE_UNMOUNT
    );
  };
  let timeoutId;
  const pauseTimer = () => {
    if (lastCloseTimerStartTimeRef < closeTimerStartTimeRef) {
      const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef;
      closeTimerRemainingTimeRef = closeTimerRemainingTimeRef - elapsedTime;
    }
    lastCloseTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
  };
  const startTimer = () => {
    closeTimerStartTimeRef = (/* @__PURE__ */ new Date()).getTime();
    timeoutId = setTimeout(
      () => {
        toast.onAutoClose?.(toast);
        deleteToast();
      },
      closeTimerRemainingTimeRef
    );
  };
  let effect2;
  onDestroy(() => {
    dispatch("setHeights", heights.filter((height) => height.toastId !== toast.id));
  });
  if ($$props.toast === void 0 && $$bindings.toast && toast !== void 0)
    $$bindings.toast(toast);
  if ($$props.toasts === void 0 && $$bindings.toasts && toasts !== void 0)
    $$bindings.toasts(toasts);
  if ($$props.index === void 0 && $$bindings.index && index !== void 0)
    $$bindings.index(index);
  if ($$props.expanded === void 0 && $$bindings.expanded && expanded !== void 0)
    $$bindings.expanded(expanded);
  if ($$props.invert === void 0 && $$bindings.invert && invert !== void 0)
    $$bindings.invert(invert);
  if ($$props.heights === void 0 && $$bindings.heights && heights !== void 0)
    $$bindings.heights(heights);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.visibleToasts === void 0 && $$bindings.visibleToasts && visibleToasts !== void 0)
    $$bindings.visibleToasts(visibleToasts);
  if ($$props.expandByDefault === void 0 && $$bindings.expandByDefault && expandByDefault !== void 0)
    $$bindings.expandByDefault(expandByDefault);
  if ($$props.closeButton === void 0 && $$bindings.closeButton && closeButton !== void 0)
    $$bindings.closeButton(closeButton);
  if ($$props.interacting === void 0 && $$bindings.interacting && interacting !== void 0)
    $$bindings.interacting(interacting);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.descriptionClass === void 0 && $$bindings.descriptionClass && descriptionClass !== void 0)
    $$bindings.descriptionClass(descriptionClass);
  isFront = index === 0;
  isVisible = index + 1 <= visibleToasts;
  toastType = toast.type;
  toastClass = toast.class || "";
  toastDescriptionClass = toast.descriptionClass || "";
  heightIndex = heights.findIndex((height) => height.toastId === toast.id) || 0;
  coords = position.split("-");
  toastsHeightBefore = heights.reduce(
    (prev, curr, reducerIndex) => {
      if (reducerIndex >= heightIndex)
        return prev;
      return prev + curr.height;
    },
    0
  );
  invert = toast.invert || invert;
  disabled = toastType === "loading";
  {
    {
      offset2 = heightIndex * GAP$1 + toastsHeightBefore;
    }
  }
  isPromiseLoadingOrInfiniteDuration = toast.promise && toastType === "loading" || toast.duration === Number.POSITIVE_INFINITY;
  $$subscribe_effect(effect2 = useEffect(() => {
    if (!isPromiseLoadingOrInfiniteDuration) {
      if (expanded || interacting) {
        pauseTimer();
      } else {
        startTimer();
      }
    }
    return () => clearTimeout(timeoutId);
  }));
  {
    if (toast.delete) {
      deleteToast();
    }
  }
  $$unsubscribe_effect();
  return `<li${add_attribute("aria-live", toast.important ? "assertive" : "polite", 0)} aria-atomic="true" role="status"${add_attribute("tabindex", 0, 0)}${add_attribute("class", `${$$props.class} ${toastClass}`, 0)} data-sonner-toast=""${add_attribute("data-styled", !toast.component, 0)}${add_attribute("data-mounted", mounted, 0)}${add_attribute("data-promise", Boolean(toast.promise), 0)}${add_attribute("data-removed", removed, 0)}${add_attribute("data-visible", isVisible, 0)}${add_attribute("data-y-position", coords[0], 0)}${add_attribute("data-x-position", coords[1], 0)}${add_attribute("data-index", index, 0)}${add_attribute("data-front", isFront, 0)}${add_attribute("data-swiping", swiping, 0)}${add_attribute("data-type", toastType, 0)}${add_attribute("data-invert", invert, 0)}${add_attribute("data-swipe-out", swipeOut, 0)}${add_attribute("data-expanded", Boolean(expanded || expandByDefault && mounted), 0)}${add_styles(merge_ssr_styles(escape(`${$$props.style} ${toast.style}`, true), {
    "--index": index,
    "--toasts-before": index,
    "--z-index": toasts.length - index,
    "--offset": `${removed ? offsetBeforeRemove : offset2}px`,
    "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`
  }))}${add_attribute("this", toastRef, 0)}>${closeButton && !toast.component ? `<button aria-label="Close toast"${add_attribute("data-disabled", disabled, 0)} data-close-button><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>` : ``} ${toast.component ? `${validate_component(toast.component || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${toast.title && typeof toast.title !== "string" ? `${validate_component(toast.title || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${toastType || toast.icon || toast.promise ? `<div data-icon="">${toast.promise ? `${validate_component(Loader, "Loader").$$render($$result, { visible: toastType === "loading" }, {}, {})}` : ``} ${toast.icon ? `${validate_component(toast.icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}` : `${validate_component(Icon2, "Icon").$$render($$result, { type: toastType }, {}, {})}`}</div>` : ``} <div data-content=""><div data-title="">${escape(toast.title)}</div> ${toast.description ? `<div data-description=""${add_attribute("class", descriptionClass + toastDescriptionClass, 0)}>${escape(toast.description)}</div>` : ``}</div> ${toast.cancel ? `<button data-button data-cancel>${escape(toast.cancel.label)}</button>` : ``} ${toast.action ? `<button data-button="">${escape(toast.action.label)}</button>` : ``}`}`}</li>`;
});
const css = {
  code: "[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial,\n      Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:6px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999}[data-sonner-toaster][data-x-position='right']{right:max(var(--offset), env(safe-area-inset-right))}[data-sonner-toaster][data-x-position='left']{left:max(var(--offset), env(safe-area-inset-left))}[data-sonner-toaster][data-x-position='center']{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position='top']{top:max(var(--offset), env(safe-area-inset-top))}[data-sonner-toaster][data-y-position='bottom']{bottom:max(var(--offset), env(safe-area-inset-bottom))}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;will-change:transform, opacity, height;-webkit-transition:transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;-moz-transition:transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;transition:transform 400ms, opacity 400ms, height 400ms, box-shadow 200ms;box-sizing:border-box;outline:none}[data-sonner-toast][data-styled='true']{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0px 4px 12px rgba(0, 0, 0, 0.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2)}[data-sonner-toast][data-y-position='top']{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position='bottom']{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast] [data-description]{font-weight:400;line-height:1.4;color:inherit}[data-sonner-toast] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:-3px;margin-right:4px}[data-sonner-toast][data-promise='true'] [data-icon]>svg{opacity:0;transform:scale(0.8);transform-origin:center;animation:sonner-fade-in 300ms ease forwards}[data-sonner-toast] [data-icon]>*{flex-shrink:0}[data-sonner-toast] [data-icon] svg{margin-left:-1px}[data-sonner-toast] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:auto;border:none;cursor:pointer;outline:none;transition:opacity 400ms, box-shadow 200ms}[data-sonner-toast] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0, 0, 0, 0.4)}[data-sonner-toast] [data-button]:first-of-type{margin-left:auto}[data-sonner-toast] [data-cancel]{color:var(--color);background:var(--border-color)}[data-sonner-toast] [data-close-button]{position:absolute;left:0;top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;background:var(--gray1);color:var(--gray12);border:1px solid var(--gray4);transform:translate(-35%, -35%);border-radius:50%;opacity:0;cursor:pointer;z-index:1;transition:opacity 100ms, background 200ms, border-color 200ms}[data-sonner-toast] [data-close-button]:focus-visible{box-shadow:0px 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 2px rgba(0, 0, 0, 0.2)}[data-sonner-toast] [data-disabled='true']{cursor:not-allowed}[data-sonner-toast]:hover [data-close-button]{opacity:1}[data-sonner-toast]:focus [data-close-button]{opacity:1}[data-sonner-toast]:focus-within [data-close-button]{opacity:1}[data-sonner-toast]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping='true']:before{content:'';position:absolute;left:0;right:0;height:100%}[data-sonner-toast][data-y-position='top'][data-swiping='true']:before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position='bottom'][data-swiping='true']:before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping='false'][data-removed='true']:before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast]:after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted='true']{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded='false'][data-front='false']{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity 400ms}[data-sonner-toast][data-expanded='false'][data-front='false'][data-styled='true']>*{opacity:0}[data-sonner-toast][data-visible='false']{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted='true'][data-expanded='true']{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed='true'][data-front='true'][data-swipe-out='false']{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='true']{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed='true'][data-front='false'][data-swipe-out='false'][data-expanded='false']{--y:translateY(40%);opacity:0;transition:transform 500ms, opacity 200ms}[data-sonner-toast][data-removed='true'][data-front='false']:before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping='true']{transform:var(--y) translateY(var(--swipe-amount, 0px));transition:none}[data-sonner-toast][data-swipe-out='true'][data-y-position='bottom'],[data-sonner-toast][data-swipe-out='true'][data-y-position='top']{animation:swipe-out 200ms ease-out forwards}@keyframes swipe-out{from{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));opacity:1}to{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));opacity:0}}@media(max-width: 600px){[data-sonner-toaster]{position:fixed;--mobile-offset:16px;right:var(--mobile-offset);left:var(--mobile-offset);width:100%}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - 32px)}[data-sonner-toaster][data-x-position='left']{left:var(--mobile-offset)}[data-sonner-toaster][data-y-position='bottom']{bottom:20px}[data-sonner-toaster][data-y-position='top']{top:20px}[data-sonner-toaster][data-x-position='center']{left:var(--mobile-offset);right:var(--mobile-offset);transform:none}}[data-sonner-toaster][data-theme='light']{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 91%);--success-text:hsl(140, 100%, 27%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%);--info-bg:hsl(210, 85%, 96%);--info-border:hsl(210, 92%, 91%);--info-text:hsl(210, 100%, 27%);--warning-bg:hsl(60, 85%, 96%);--warning-border:hsl(60, 92%, 91%);--warning-text:hsl(60, 100%, 19%)}[data-sonner-toaster][data-theme='light'] [data-sonner-toast][data-invert='true']{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-theme='dark'] [data-sonner-toast][data-invert='true']{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-theme='dark']{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%);--info-bg:hsl(210, 100%, 6%);--info-border:hsl(207, 100%, 12%);--info-text:hsl(210, 86%, 65%);--warning-bg:hsl(60, 100%, 6%);--warning-border:hsl(57, 100%, 12%);--warning-text:hsl(60, 86%, 65%)}[data-rich-colors='true'] [data-sonner-toast][data-type='success']{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='success'] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='error']{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='error'] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='info']{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='info'] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='warning']{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors='true'] [data-sonner-toast][data-type='warning'] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible='false']{transform-origin:center;animation:sonner-fade-out 0.2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(0.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-0.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-0.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-0.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-0.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-0.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-0.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-0.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-0.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-0.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(0.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:0.15}}@media(prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none !important;animation:none !important}}",
  map: null
};
const VISIBLE_TOASTS_AMOUNT = 3;
const VIEWPORT_OFFSET = "32px";
const TOAST_WIDTH = 356;
const GAP = 14;
function getInitialTheme(t) {
  if (t !== "system") {
    return t;
  }
  if (typeof window !== "undefined") {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  }
  return "light";
}
const Toaster = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let coords;
  let hotkeyLabel;
  let { invert = false } = $$props;
  let { theme = "light" } = $$props;
  let { position = "bottom-right" } = $$props;
  let { hotkey = ["altKey", "KeyT"] } = $$props;
  let { richColors = false } = $$props;
  let { expand = false } = $$props;
  let { duration = null } = $$props;
  let { visibleToasts = VISIBLE_TOASTS_AMOUNT } = $$props;
  let { closeButton = false } = $$props;
  let { toastOptions = {} } = $$props;
  let { offset: offset2 = null } = $$props;
  let toasts = [];
  let heights = [];
  let expanded = false;
  let interacting = false;
  getInitialTheme(theme);
  let listRef;
  onDestroy(() => {
  });
  if ($$props.invert === void 0 && $$bindings.invert && invert !== void 0)
    $$bindings.invert(invert);
  if ($$props.theme === void 0 && $$bindings.theme && theme !== void 0)
    $$bindings.theme(theme);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.hotkey === void 0 && $$bindings.hotkey && hotkey !== void 0)
    $$bindings.hotkey(hotkey);
  if ($$props.richColors === void 0 && $$bindings.richColors && richColors !== void 0)
    $$bindings.richColors(richColors);
  if ($$props.expand === void 0 && $$bindings.expand && expand !== void 0)
    $$bindings.expand(expand);
  if ($$props.duration === void 0 && $$bindings.duration && duration !== void 0)
    $$bindings.duration(duration);
  if ($$props.visibleToasts === void 0 && $$bindings.visibleToasts && visibleToasts !== void 0)
    $$bindings.visibleToasts(visibleToasts);
  if ($$props.closeButton === void 0 && $$bindings.closeButton && closeButton !== void 0)
    $$bindings.closeButton(closeButton);
  if ($$props.toastOptions === void 0 && $$bindings.toastOptions && toastOptions !== void 0)
    $$bindings.toastOptions(toastOptions);
  if ($$props.offset === void 0 && $$bindings.offset && offset2 !== void 0)
    $$bindings.offset(offset2);
  $$result.css.add(css);
  coords = position.split("-");
  hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
  {
    if (toasts.length <= 1) {
      expanded = false;
    }
  }
  return `${toasts.length > 0 ? `<section${add_attribute("aria-label", `Notifications ${hotkeyLabel}`, 0)}${add_attribute("tabindex", -1, 0)}><ol${add_attribute("tabindex", -1, 0)}${add_attribute("class", $$props.class, 0)} data-sonner-toaster${add_attribute("data-theme", theme, 0)}${add_attribute("data-rich-colors", richColors, 0)}${add_attribute("data-y-position", coords[0], 0)}${add_attribute("data-x-position", coords[1], 0)}${add_styles(merge_ssr_styles(escape($$props.style, true), {
    "--front-toast-height": `${heights[0]?.height}px`,
    "--offset": typeof offset2 === "number" ? `${offset2}px` : offset2 || VIEWPORT_OFFSET,
    "--width": `${TOAST_WIDTH}px`,
    "--gap": `${GAP}px`
  }))}${add_attribute("this", listRef, 0)}>${each(toasts, (toast, index) => {
    return `${validate_component(Toast$1, "Toast").$$render(
      $$result,
      {
        index,
        toast,
        duration,
        class: toastOptions?.class,
        descriptionClass: toastOptions?.descriptionClass,
        invert: Boolean(invert),
        visibleToasts,
        closeButton: Boolean(closeButton),
        interacting,
        position,
        style: toastOptions?.style ?? "",
        toasts,
        heights,
        expandByDefault: Boolean(expand),
        expanded
      },
      {},
      {}
    )}`;
  })}</ol></section>` : ``}`;
});
const style = "background: hsl(222.2, 84%, 4.9%); color: var(--card-foreground); z-index: 9999; opacity: 1;";
const Toast = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div${add_attribute("class", "dark", 0)}>${validate_component(Toaster, "Toaster").$$render(
    $$result,
    {
      richColors: true,
      toastOptions: { style }
    },
    {},
    {}
  )}</div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let isConnected;
  let $accountStore, $$unsubscribe_accountStore;
  $$unsubscribe_accountStore = subscribe(accountStore, (value) => $accountStore = value);
  $accountStore?.provider;
  $accountStore?.address;
  isConnected = $accountStore?.isConnected;
  $$unsubscribe_accountStore();
  return `${validate_component(Toast, "Toast").$$render($$result, {}, {}, {})} ${!isConnected ? `<div class="absolute z-10 inset-0 bg-opacity-10 bg-black h-screen backdrop-blur"></div>` : ``} ${validate_component(Nav, "Nav").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
