import { c as create_ssr_component, o as subscribe, v as validate_component, M as escape } from "../../../chunks/ssr.js";
import { j as cn, S as Separator, B as Button, A as APP_NAME } from "../../../chunks/separator.js";
import { C as Card, a as Card_header, b as Card_title, c as Card_content } from "../../../chunks/card-content.js";
import { C as Card_description, a as Card_footer } from "../../../chunks/card-footer.js";
import { E as Eth, U as Usdc } from "../../../chunks/usdc.js";
import { w as web3Store } from "../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let usdcBalance;
  let ethBalance;
  let ethPrice;
  let ethBalanceUSD;
  let $web3Store, $$unsubscribe_web3Store;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  const { format } = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  usdcBalance = $web3Store?.balances["USDC"]?.small ?? 0;
  ethBalance = $web3Store?.balances["WETH"]?.small ?? 0;
  ethPrice = $web3Store?.ethPrice?.small ?? 0;
  ethBalanceUSD = ethBalance * ethPrice;
  $$unsubscribe_web3Store();
  return `<section class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `Your Wallet`;
            }
          })} ${validate_component(Card_description, "CardDescription").$$render($$result, {}, {}, {
            default: () => {
              return `This page shows your wallet balance in terms of Ether (ETH) and US Dollar Coin (USDC). You
				use this page to either purchase ETH, sell USDC for fiat currency or transfer ETH/USDC to
				another wallet. If you already have ETH or USDC, you can send them to your wallet address.`;
            }
          })}`;
        }
      })}`;
    }
  })} ${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center"><div class="h-10 w-10 mr-2">${validate_component(Eth, "ETH").$$render($$result, {}, {}, {})}</div> ${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `ETH Balance`;
            }
          })}</div>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: "mb-5" }, {}, {})} ${validate_component(Card_content, "CardContent").$$render($$result, { class: "" }, {}, {
        default: () => {
          return `<section class="flex flex-col justify-between"><p>ETH (or Ether) is the native cryptocurrency of the Ethereum blockchain. It has a variable
					price. You can purchase ETH with fiat currency or receive it from another wallet. the ${escape(APP_NAME)} ${escape(" ")}
					app allows you to supply your ETH as collateral, and borrow USDC which can be exchanged for
					any fiat currency of your choice.</p> <div class="flex flex-col mt-5"><p class="text-md leading-none mb-2" data-svelte-h="svelte-s8gnhr">Balance</p> <div class="flex items-center space-x-4"><p class="text-xl font-bold">${escape(ethBalance)} ETH</p> <p class="text-xl">(${escape(format(ethBalanceUSD))})</p></div></div></section>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-1/2 mr-1" }, {}, {
            default: () => {
              return `Buy`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "w-1/2 ml-1",
              variant: "secondary"
            },
            {},
            {
              default: () => {
                return `Send/Receive`;
              }
            }
          )}`;
        }
      })}`;
    }
  })} ${validate_component(Card, "Card").$$render($$result, { class: cn("w-full") }, {}, {
    default: () => {
      return `${validate_component(Card_header, "CardHeader").$$render($$result, {}, {}, {
        default: () => {
          return `<div class="flex items-center"><div class="h-10 w-10 mr-2">${validate_component(Usdc, "USDC").$$render(
            $$result,
            {
              dark: "transparent",
              light: "white"
            },
            {},
            {}
          )}</div> ${validate_component(Card_title, "CardTitle").$$render($$result, {}, {}, {
            default: () => {
              return `USDC Balance`;
            }
          })}</div>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: "mb-5" }, {}, {})} ${validate_component(Card_content, "CardContent").$$render($$result, { class: "" }, {}, {
        default: () => {
          return `<section class="flex flex-col justify-between"><p data-svelte-h="svelte-z3la1c">USDC (or US Dollar Coin) is a Stablecoin that is pegged to the US Dollar. You can sell
					USDC for fiat currency or transfer USDC to another wallet.</p> <div class="flex flex-col mt-5"><p class="text-md leading-none mb-2" data-svelte-h="svelte-s8gnhr">Balance</p> <p class="text-xl font-bold">${escape(format(usdcBalance))}</p></div></section>`;
        }
      })} ${validate_component(Separator, "Separator").$$render($$result, { class: " mb-5" }, {}, {})} ${validate_component(Card_footer, "CardFooter").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { class: "w-1/2 mr-1" }, {}, {
            default: () => {
              return `Sell`;
            }
          })} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "w-1/2 ml-1",
              variant: "secondary"
            },
            {},
            {
              default: () => {
                return `Send/Receive`;
              }
            }
          )}`;
        }
      })}`;
    }
  })}</section>`;
});
export {
  Page as default
};
