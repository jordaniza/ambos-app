import { c as create_ssr_component, v as validate_component, o as subscribe, M as escape, L as add_attribute } from "../../../chunks/ssr.js";
import { j as cn, S as Separator, B as Button, A as APP_NAME } from "../../../chunks/separator.js";
import { B as BLOCK_EXPLORER_URLS } from "../../../chunks/contracts.js";
import { a as accountStore } from "../../../chunks/index2.js";
import { ChainId } from "@biconomy/core-types";
import { I as IconBase } from "../../../chunks/IconBase.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
const IoMdPerson = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => {
      return `<path d="M256 256c52.805 0 96-43.201 96-96s-43.195-96-96-96-96 43.201-96 96 43.195 96 96 96zm0 48c-63.598 0-192 32.402-192 96v48h384v-48c0-63.598-128.402-96-192-96z"></path>`;
    }
  })}`;
});
const IoMdClipboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(IconBase, "IconBase").$$render($$result, Object.assign({}, { viewBox: "0 0 512 512" }, $$props), {}, {
    default: () => {
      return `<path d="M405.333 80h-87.35C310.879 52.396 285.821 32 256 32s-54.879 20.396-61.983 48h-87.35C83.198 80 64 99.198 64 122.667v314.665C64 460.801 83.198 480 106.667 480h298.666C428.802 480 448 460.801 448 437.332V122.667C448 99.198 428.802 80 405.333 80zM256 80c11.729 0 21.333 9.599 21.333 21.333s-9.604 21.334-21.333 21.334-21.333-9.6-21.333-21.334S244.271 80 256 80zm152 360H104V120h40v72h224v-72h40v320z"></path>`;
    }
  })}`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let address;
  let truncatedAddress;
  let $accountStore, $$unsubscribe_accountStore;
  $$unsubscribe_accountStore = subscribe(accountStore, (value) => $accountStore = value);
  let chainId = ChainId.POLYGON_MUMBAI;
  const truncateAddress = (address2) => {
    if (!address2)
      return "Address goes here...";
    return `${address2.slice(0, 10)}...${address2.slice(-8)}`;
  };
  address = $accountStore?.address;
  truncatedAddress = truncateAddress(address);
  $$unsubscribe_accountStore();
  return `<section class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center"><div class="h-8 w-8 mr-2">${validate_component(IoMdPerson, "PersonIcon").$$render($$result, { class: "w-8 h-8 mr-2" }, {}, {})}</div> ${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Your Profile`;
            }
          })}</div>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: "mb-5" }, {}, {})} ${validate_component(Card_content, "CardContent").$$render($$result, { class: "" }, {}, {
        default: () => {
          return `<section class="flex flex-col justify-between"><p>On this page you&#39;ll find some advanced details about your wallet on Ethereum.
					<br> <br> ${escape(APP_NAME)}${escape(" ")}
					gives you complete control over your assets. The addresses listed below are soley controlled
					by you, as is all the money in your wallet.</p> <div class="flex flex-col mt-5"><p class="my-5 font-bold" data-svelte-h="svelte-e2hs6p">Your Ethereum Wallet:</p> <div class="flex justify-between items-center border p-2 rounded-md"><code class="font-mono ml-2">${escape(truncatedAddress)}</code> ${validate_component(Button, "Button").$$render($$result, { variant: "ghost" }, {}, {
            default: () => {
              return `<div class="h-8 w-8 mr-2">${validate_component(IoMdClipboard, "ClipboardCopyIcon").$$render($$result, { class: "w-8 h-8 mr-2" }, {}, {})}</div>`;
            }
          })}</div> <p class="my-5" data-svelte-h="svelte-142t5hm">Your Ethereum wallet is a unique address on the Ethereum blockchain. This address is
						where your ETH and USDC will be stored.
						<br> <br>
						You can check out the transaction history at the link below.</p></div> ${validate_component(Button, "Button").$$render($$result, { class: "mt-2", variant: "outline" }, {}, {
            default: () => {
              return `<a${add_attribute("href", BLOCK_EXPLORER_URLS[chainId] + "/address/" + address, 0)} class="w-full" target="_blank">View on Explorer</a>`;
            }
          })}</section>`;
        }
      })}`;
    }
  })}</section>`;
});
export {
  Page as default
};
