import { S as SupportedTokens } from "./contracts.js";
import { w as writable } from "./index.js";
const defaultLoanDataItem = {
  big: null,
  small: null,
  decimals: null
};
const defaultPoolLoanData = {
  ltv: defaultLoanDataItem,
  stableBorrowingEnabled: false,
  variableBorrowingRate: defaultLoanDataItem,
  stableBorrowingRate: defaultLoanDataItem,
  lastUpdatedBlock: null
};
const defaultUserLoanData = {
  totalCollateralBase: defaultLoanDataItem,
  totalDebtBase: defaultLoanDataItem,
  availableBorrowBase: defaultLoanDataItem,
  currentLiquidationThreshold: defaultLoanDataItem,
  ltv: defaultLoanDataItem,
  healthFactor: defaultLoanDataItem,
  lastUpdatedBlock: null
};
const DEFAULT_STORE = {
  ethPrice: {
    big: null,
    small: null,
    decimals: null,
    lastUpdatedBlock: null
  },
  userPoolData: defaultUserLoanData,
  poolReserveData: defaultPoolLoanData,
  balances: SupportedTokens.reduce((acc, token) => {
    acc[token] = {
      big: null,
      small: null,
      decimals: null,
      lastUpdatedBlock: null
    };
    return acc;
  }, {})
};
const web3Store = writable(DEFAULT_STORE);
export {
  web3Store as w
};
