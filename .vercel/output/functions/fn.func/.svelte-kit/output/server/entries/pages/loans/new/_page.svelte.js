import { s as setContext, l as getContext, c as create_ssr_component, o as subscribe, p as onDestroy, q as compute_rest_props, t as spread, u as escape_object, v as validate_component, R as escape_attribute_value, L as add_attribute, M as escape } from "../../../../chunks/ssr.js";
import { w as writable, d as derived } from "../../../../chunks/index.js";
import { a as accountStore } from "../../../../chunks/index2.js";
import { b as builder, d as addMeltEventListener, r as removeUndefined, g as getOptionUpdater, h as isBrowser, o as is_void, s as setTransitionTimes, j as cn, p as buttonVariants, l as flyAndScale, m as f, S as Separator, B as Button, A as APP_NAME } from "../../../../chunks/separator.js";
import { w as web3Store } from "../../../../chunks/index3.js";
import { B as BLOCK_EXPLORER_URLS } from "../../../../chunks/contracts.js";
import "@biconomy/paymaster";
import { ChainId } from "@biconomy/core-types";
import { j as createDialog, k as createDispatcher, l as fade, p as toast } from "../../../../chunks/Toaster.svelte_svelte_type_style_lang.js";
import "dequal";
import { C as Card_description, a as Card_footer } from "../../../../chunks/card-footer.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../../chunks/card-content.js";
import "clsx";
function createLabel() {
  const root = builder("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
const NAME = "AlertDialog";
function set(props) {
  const alertDialog = createDialog({
    ...removeUndefined(props),
    role: "alertdialog"
  });
  setContext(NAME, {
    ...alertDialog,
    transitionTimes: props.transitionTimes,
    tOpen: props.tOpen
  });
  return {
    ...alertDialog,
    updateOption: getOptionUpdater(alertDialog.options)
  };
}
function get() {
  return getContext(NAME);
}
const ctx$1 = {
  set,
  get
};
const AlertDialog = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $transitionTimes, $$unsubscribe_transitionTimes;
  let $tOpen, $$unsubscribe_tOpen;
  let { preventScroll = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = false } = $$props;
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
      if (open !== next) {
        onOpenChange?.(next);
      }
      if (next !== $tOpen) {
        tOpen.set(next);
        if (!next) {
          window.clearTimeout(timeout);
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
    if (isBrowser) {
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
const AlertDialogTitle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["level", "asChild"]);
  let $title, $$unsubscribe_title;
  let { level = "h2" } = $$props;
  let { asChild = false } = $$props;
  const title = ctx$1.get().elements.title;
  $$unsubscribe_title = subscribe(title, (value) => $title = value);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_title();
  return `${asChild ? `${slots.default ? slots.default({ builder: $title }) : ``}` : (() => {
    let builder2 = $title;
    return ` ${((tag) => {
      return tag ? `<${level}${spread([escape_object(builder2), escape_object($$restProps)], {})}>${is_void(tag) ? "" : `${slots.default ? slots.default({ builder: builder2 }) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
    })(level)}`;
  })()}`;
});
const AlertDialogAction = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const AlertDialogCancel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const AlertDialogPortal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const AlertDialogContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const AlertDialogOverlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const AlertDialogTrigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
const ctx = {
  get: () => createLabel()
};
const Label$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["asChild"]);
  let $root, $$unsubscribe_root;
  let { asChild = false } = $$props;
  const { elements: { root } } = ctx.get();
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  createDispatcher();
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0)
    $$bindings.asChild(asChild);
  $$unsubscribe_root();
  return ` ${asChild ? `${slots.default ? slots.default({ builder: $root }) : ``}` : (() => {
    let builder2 = $root;
    return ` <label${spread([escape_object(builder2), escape_object($$restProps)], {})}>${slots.default ? slots.default({ builder: builder2 }) : ``}</label>`;
  })()}`;
});
const TX_STATES_FULL = [
  "STARTED",
  "SIGNING",
  "SIGNED",
  "CONFIRMED",
  "REJECTED",
  "SUCCESSFUL",
  "FAILED"
];
const TX_STATES = {
  PENDING: ["STARTED", "SIGNING", "SIGNED", "CONFIRMED"],
  FULFILLED: ["SUCCESSFUL"],
  REJECTED: ["REJECTED", "FAILED"]
};
const SUPPORTED_SINGLE_TRANSACTIONS = [
  // increase debt
  "APPROVE_WETH",
  "SUPPLY_WETH",
  "BORROW_USDC",
  // decrease debt
  "APPROVE_AWETH",
  "REPAY_USDC",
  "WITHDRAW_WETH",
  // eth/weth
  "UNWRAP_WETH",
  "WRAP_WETH",
  // swaps
  "SWAP_WETH_USDC",
  "SWAP_USDC_WETH",
  "SWAP_WETH_ETH",
  "SWAP_ETH_WETH",
  "SWAP_ETH_USDC",
  "SWAP_USDC_ETH",
  // send tokens
  "SEND_USDC",
  "SEND_WETH",
  "SEND_ETH"
];
const SUPPORTED_BATCH_TRANSACTIONS = {
  INCREASE_DEBT: [
    "APPROVE_WETH",
    "SUPPLY_WETH",
    "BORROW_USDC"
  ],
  DECREASE_DEBT: [
    "APPROVE_AWETH",
    "REPAY_USDC",
    "WITHDRAW_WETH"
  ]
};
[
  ...SUPPORTED_SINGLE_TRANSACTIONS,
  ...Object.keys(SUPPORTED_BATCH_TRANSACTIONS)
];
const txStoreFull = writable({});
derived(
  txStoreFull,
  ($txStoreFull) => {
    const derivedTxStore = {};
    Object.keys($txStoreFull).forEach((transactionType) => {
      const transactionDetail = $txStoreFull[transactionType];
      if (!transactionDetail) {
        return;
      }
      const state = transactionDetail.state;
      if (!TX_STATES_FULL.includes(state)) {
        throw new Error(`Invalid transaction state: ${state}`);
      }
      if (TX_STATES.PENDING.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "PENDING"
        };
      } else if (TX_STATES.FULFILLED.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "FULFILLED"
        };
      } else if (TX_STATES.REJECTED.includes(state)) {
        derivedTxStore[transactionType] = {
          ...transactionDetail,
          state: "REJECTED"
        };
      } else {
        console.error("unhandled transaction state");
        return;
      }
    });
    return derivedTxStore;
  }
);
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Label$1, "LabelPrimitive.Root").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)
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
const Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "value"]);
  let { class: className = void 0 } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  return `<input${spread(
    [
      {
        class: escape_attribute_value(cn("flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("value", value, 0)}>`;
});
const Alert_dialog_title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "level"]);
  let { class: className = void 0 } = $$props;
  let { level = "h3" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.level === void 0 && $$bindings.level && level !== void 0)
    $$bindings.level(level);
  return `${validate_component(AlertDialogTitle, "AlertDialogPrimitive.Title").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn("text-lg font-semibold", className)
      },
      { level },
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
const Alert_dialog_action = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(AlertDialogAction, "AlertDialogPrimitive.Action").$$render($$result, Object.assign({}, { class: cn(buttonVariants(), className) }, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Alert_dialog_cancel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(AlertDialogCancel, "AlertDialogPrimitive.Cancel").$$render(
    $$result,
    Object.assign(
      {},
      {
        class: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)
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
const Alert_dialog_portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  return `${validate_component(AlertDialogPortal, "AlertDialogPrimitive.Portal").$$render($$result, Object.assign({}, $$restProps), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Alert_dialog_footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Alert_dialog_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class"]);
  let { class: className = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `<div${spread(
    [
      {
        class: escape_attribute_value(cn("flex flex-col space-y-2 text-center sm:text-left", className))
      },
      escape_object($$restProps)
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div>`;
});
const Alert_dialog_overlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  return `${validate_component(AlertDialogOverlay, "AlertDialogPrimitive.Overlay").$$render(
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
const Alert_dialog_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["transition", "transitionConfig", "class"]);
  let { transition = flyAndScale } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { class: className = void 0 } = $$props;
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0)
    $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0)
    $$bindings.transitionConfig(transitionConfig);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  return `${validate_component(Alert_dialog_portal, "AlertDialog.Portal").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Alert_dialog_overlay, "AlertDialog.Overlay").$$render($$result, {}, {}, {})} ${validate_component(AlertDialogContent, "AlertDialogPrimitive.Content").$$render(
        $$result,
        Object.assign(
          {},
          { transition },
          { transitionConfig },
          {
            class: cn("fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full", className)
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
    }
  })}`;
});
const Root = AlertDialog;
const Trigger = AlertDialogTrigger;
const MAX_PERCENT_BORROW = 0.5;
function updateMessage(state2) {
  switch (state2) {
    case "STARTED":
      return ["Started a new loan.", false];
    case "SIGNING":
      return ["Awaiting Signature", true];
    case "SIGNED":
      return ["Loan submitted, awaiting confirmation", true];
    case "CONFIRMED":
      return ["Transaction confirmed, your loan is being processed.", true];
    case "FAILED":
      return ["There was a problem processing your loan.", true];
    case "REJECTED":
      return ["Your loan application was rejected", true];
    case "SUCCESSFUL":
      return ["Success! Your loan has been processed successfully.", true];
    default:
      return ["", false];
  }
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let state;
  let hash;
  let wethBalance;
  let ethPrice;
  let valueDepositETH;
  let maxDepositUSD;
  let maxBorrowUSD;
  let $web3Store, $$unsubscribe_web3Store;
  let $txStoreFull, $$unsubscribe_txStoreFull;
  let $accountStore, $$unsubscribe_accountStore;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  $$unsubscribe_txStoreFull = subscribe(txStoreFull, (value) => $txStoreFull = value);
  $$unsubscribe_accountStore = subscribe(accountStore, (value) => $accountStore = value);
  let valueDepositUSD = 0;
  let valueBorrowUSD = 0;
  const chainId = ChainId.POLYGON_MUMBAI;
  let warnDeposit = false;
  let warnBorrow = false;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    state = $txStoreFull["INCREASE_DEBT"]?.state;
    $accountStore?.address;
    $accountStore?.provider;
    $accountStore?.smartAccount;
    hash = $txStoreFull["INCREASE_DEBT"]?.receiptHash;
    wethBalance = $web3Store.balances["WETH"];
    ethPrice = $web3Store.ethPrice;
    maxDepositUSD = (wethBalance?.small ?? 0) * (ethPrice.small ?? 0);
    {
      if (valueDepositUSD > maxDepositUSD) {
        valueDepositUSD = maxDepositUSD;
        warnDeposit = true;
        setTimeout(
          () => {
            warnDeposit = false;
          },
          5e3
        );
      }
    }
    valueDepositETH = ethPrice.small ? valueDepositUSD / ethPrice.small : 0;
    maxBorrowUSD = valueDepositUSD * MAX_PERCENT_BORROW;
    {
      if (state !== void 0) {
        const [message, showToast] = updateMessage(state);
        if (message && showToast) {
          toast(message);
        }
      }
    }
    {
      if (valueBorrowUSD > maxBorrowUSD) {
        valueBorrowUSD = maxBorrowUSD;
        warnBorrow = true;
        setTimeout(
          () => {
            warnBorrow = false;
          },
          5e3
        );
      }
    }
    $$rendered = `<section class="flex flex-col gap-5 p-4">${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
      default: () => {
        return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
          default: () => {
            return `<div class="flex justify-between mb-5">${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
              default: () => {
                return `New Loan`;
              }
            })}</div> ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
              default: () => {
                return `With ${escape(APP_NAME)} you can deposit ETH and borrow USDC. You can borrow up to 50% of the current
				value of your deposit.
				<br> <br>
				Adjust the parameters below to set the dollar value of the amounts you want to deposit and borrow.`;
              }
            })}`;
          }
        })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_content, "CardContent").$$render($$result, {}, {}, {
          default: () => {
            return `<section class="pt-5 pb-10 flex flex-col gap-10"><div class="grid w-full max-w-sm items-center gap-1.5">${validate_component(Label, "Label").$$render($$result, { for: "supply" }, {}, {
              default: () => {
                return `How much do you want to supply in USD?`;
              }
            })} <p class="italic text-sm">Max ${escape(f(maxDepositUSD))} (${escape(wethBalance?.small ?? 0)} ETH)</p> ${warnDeposit ? `<p class="text-red-500 text-sm">You can only supply up to ${escape(f(maxDepositUSD))}</p>` : ``} <div class="flex gap-1">${validate_component(Input, "Input").$$render(
              $$result,
              {
                class: "w-3/4",
                type: "text",
                id: "supply",
                placeholder: "0",
                value: valueDepositUSD
              },
              {
                value: ($$value) => {
                  valueDepositUSD = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Button, "Button").$$render($$result, { class: "w-1/4", variant: "secondary" }, {}, {
              default: () => {
                return `Max`;
              }
            })}</div></div> <div class="grid w-full max-w-sm items-center gap-1">${validate_component(Label, "Label").$$render($$result, { for: "borrow" }, {}, {
              default: () => {
                return `How much do you want to borrow in USD?`;
              }
            })} <p class="italic text-sm">Max ${escape(f(maxBorrowUSD))}</p> ${warnBorrow ? `<p class="text-red-500 text-sm">You can only borrow up to ${escape(f(maxBorrowUSD))}</p>` : ``} <div class="flex gap-1">${validate_component(Input, "Input").$$render(
              $$result,
              {
                class: "w-3/4",
                type: "text",
                id: "borrow",
                placeholder: "0",
                value: valueBorrowUSD
              },
              {
                value: ($$value) => {
                  valueBorrowUSD = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Button, "Button").$$render($$result, { class: "w-1/4", variant: "secondary" }, {}, {
              default: () => {
                return `Max`;
              }
            })}</div></div></section> <section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3"><div class="flex justify-between items-center"><span class="font-bold" data-svelte-h="svelte-1dkqszy">Depositing</span> <span class="font-semibold">${escape(f(valueDepositUSD))} (${escape(valueDepositETH)} ETH)</span></div> <div class="flex justify-between items-center"><span class="font-bold" data-svelte-h="svelte-1j5kzd3">Borrowing</span> <span class="font-semibold">${escape(f(valueBorrowUSD ?? 0))}</span></div></section>`;
          }
        })} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Root, "AlertDialog").$$render($$result, {}, {}, {
              default: () => {
                return `${validate_component(Trigger, "AlertDialogTrigger").$$render($$result, { asChild: true }, {}, {
                  default: ({ builder: builder2 }) => {
                    return `${validate_component(Button, "Button").$$render(
                      $$result,
                      {
                        disabled: valueBorrowUSD == 0,
                        class: "w-full mr-1",
                        builders: [builder2]
                      },
                      {},
                      {
                        default: () => {
                          return `Submit`;
                        }
                      }
                    )}`;
                  }
                })} ${validate_component(Alert_dialog_content, "AlertDialogContent").$$render($$result, {}, {}, {
                  default: () => {
                    return `${validate_component(Alert_dialog_header, "AlertDialogHeader").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Alert_dialog_title, "AlertDialogTitle").$$render($$result, {}, {}, {
                          default: () => {
                            return `Confirm Loan`;
                          }
                        })} <section class="p-4 flex flex-col gap-5 rounded border border-gray-300 my-3"><div class="flex justify-between items-center"><span class="font-bold" data-svelte-h="svelte-1dkqszy">Depositing</span> <span class="font-semibold">${escape(f(valueDepositUSD))} (${escape(valueDepositETH)} ETH)</span></div> <div class="flex justify-between items-center"><span class="font-bold" data-svelte-h="svelte-1vmimq3">Borrowing</span> <span class="font-semibold">${escape(f(valueBorrowUSD ?? 0))}</span></div></section>`;
                      }
                    })} ${validate_component(Alert_dialog_footer, "AlertDialogFooter").$$render($$result, {}, {}, {
                      default: () => {
                        return `${validate_component(Alert_dialog_cancel, "AlertDialogCancel").$$render($$result, {}, {}, {
                          default: () => {
                            return `Cancel`;
                          }
                        })} ${validate_component(Alert_dialog_action, "AlertDialogAction").$$render($$result, {}, {}, {
                          default: () => {
                            return `${validate_component(Button, "Button").$$render($$result, { variant: "ghost" }, {}, {
                              default: () => {
                                return `Confirm`;
                              }
                            })}`;
                          }
                        })}`;
                      }
                    })}`;
                  }
                })}`;
              }
            })} ${validate_component(Button, "Button").$$render(
              $$result,
              {
                class: "w-full ml-1",
                variant: "secondary"
              },
              {},
              {
                default: () => {
                  return `Reset`;
                }
              }
            )}`;
          }
        })}`;
      }
    })} ${state ? `<div class="card m-2 p-2 rounded"><dl class="list-dl"><div><span class="flex-auto"><dt data-svelte-h="svelte-4im1ys">Transaction Status</dt> <dd>State: ${escape(state)}</dd> ${hash ? `<a${add_attribute("href", `${BLOCK_EXPLORER_URLS[chainId]}/tx/${hash}`, 0)} target="_blank" class="text-blue-500 underline">View Transaction</a>` : ``}</span></div></dl></div>` : ``}</section>`;
  } while (!$$settled);
  $$unsubscribe_web3Store();
  $$unsubscribe_txStoreFull();
  $$unsubscribe_accountStore();
  return $$rendered;
});
export {
  Page as default
};
