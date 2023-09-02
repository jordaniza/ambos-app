import "@biconomy/bundler";
import "@biconomy/account";
import "@biconomy/paymaster";
import "@biconomy/particle-auth";
import { w as writable } from "./index.js";
const defaults = {
  smartAccount: void 0,
  loading: false,
  error: void 0,
  provider: void 0,
  bundler: void 0,
  address: void 0,
  paymaster: void 0,
  userInfo: void 0,
  isConnected: false
};
const accountStore = writable(defaults);
export {
  accountStore as a
};
