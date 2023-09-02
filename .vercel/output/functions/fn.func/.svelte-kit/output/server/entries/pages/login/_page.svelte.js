import { c as create_ssr_component, o as subscribe, N as each, M as escape } from "../../../chunks/ssr.js";
import { a as accountStore } from "../../../chunks/index2.js";
import { w as web3Store } from "../../../chunks/index3.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tableArr;
  let $web3Store, $$unsubscribe_web3Store;
  let $accountStore, $$unsubscribe_accountStore;
  $$unsubscribe_web3Store = subscribe(web3Store, (value) => $web3Store = value);
  $$unsubscribe_accountStore = subscribe(accountStore, (value) => $accountStore = value);
  tableArr = Object.entries($web3Store.balances).map(([id, balance]) => {
    return {
      name: id,
      balance: balance.small,
      lastUpdated: balance.lastUpdatedBlock
    };
  });
  $$unsubscribe_web3Store();
  $$unsubscribe_accountStore();
  return `<div class="table-container"> <table class="table table-hover"><thead data-svelte-h="svelte-aho9op"><tr><th>Asset</th> <th>Balance</th> <th>Last Updated</th></tr></thead> <tbody>${!$accountStore.address ? `<tr data-svelte-h="svelte-1uasl86"><td colspan="3">Loading...</td></tr>` : `${each(tableArr, (row) => {
    return `<tr><td>${escape(row.name)}</td> <td>${escape(row.balance)}</td> <td>${escape(row.lastUpdated)}</td> </tr>`;
  })}`}</tbody></table></div>`;
});
export {
  Page as default
};
