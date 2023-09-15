/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export declare namespace RouterETH {
  export type SwapAmountStruct = {
    amountLD: BigNumberish;
    minAmountLD: BigNumberish;
  };

  export type SwapAmountStructOutput = [BigNumber, BigNumber] & {
    amountLD: BigNumber;
    minAmountLD: BigNumber;
  };
}

export declare namespace IStargateRouter {
  export type LzTxObjStruct = {
    dstGasForCall: BigNumberish;
    dstNativeAmount: BigNumberish;
    dstNativeAddr: BytesLike;
  };

  export type LzTxObjStructOutput = [BigNumber, BigNumber, string] & {
    dstGasForCall: BigNumber;
    dstNativeAmount: BigNumber;
    dstNativeAddr: string;
  };
}

export interface StargateRouterETHInterface extends utils.Interface {
  functions: {
    "addLiquidityETH()": FunctionFragment;
    "poolId()": FunctionFragment;
    "stargateEthVault()": FunctionFragment;
    "stargateRouter()": FunctionFragment;
    "swapETHAndCall(uint16,address,bytes,(uint256,uint256),(uint256,uint256,bytes),bytes)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addLiquidityETH"
      | "poolId"
      | "stargateEthVault"
      | "stargateRouter"
      | "swapETHAndCall"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addLiquidityETH",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "poolId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "stargateEthVault",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stargateRouter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "swapETHAndCall",
    values: [
      BigNumberish,
      string,
      BytesLike,
      RouterETH.SwapAmountStruct,
      IStargateRouter.LzTxObjStruct,
      BytesLike
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "addLiquidityETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "poolId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "stargateEthVault",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stargateRouter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "swapETHAndCall",
    data: BytesLike
  ): Result;

  events: {};
}

export interface StargateRouterETH extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: StargateRouterETHInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addLiquidityETH(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;

    poolId(overrides?: CallOverrides): Promise<[number]>;

    stargateEthVault(overrides?: CallOverrides): Promise<[string]>;

    stargateRouter(overrides?: CallOverrides): Promise<[string]>;

    swapETHAndCall(
      _dstChainId: BigNumberish,
      _refundAddress: string,
      _toAddress: BytesLike,
      _swapAmount: RouterETH.SwapAmountStruct,
      _lzTxParams: IStargateRouter.LzTxObjStruct,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  addLiquidityETH(
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  poolId(overrides?: CallOverrides): Promise<number>;

  stargateEthVault(overrides?: CallOverrides): Promise<string>;

  stargateRouter(overrides?: CallOverrides): Promise<string>;

  swapETHAndCall(
    _dstChainId: BigNumberish,
    _refundAddress: string,
    _toAddress: BytesLike,
    _swapAmount: RouterETH.SwapAmountStruct,
    _lzTxParams: IStargateRouter.LzTxObjStruct,
    _payload: BytesLike,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    addLiquidityETH(overrides?: CallOverrides): Promise<void>;

    poolId(overrides?: CallOverrides): Promise<number>;

    stargateEthVault(overrides?: CallOverrides): Promise<string>;

    stargateRouter(overrides?: CallOverrides): Promise<string>;

    swapETHAndCall(
      _dstChainId: BigNumberish,
      _refundAddress: string,
      _toAddress: BytesLike,
      _swapAmount: RouterETH.SwapAmountStruct,
      _lzTxParams: IStargateRouter.LzTxObjStruct,
      _payload: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    addLiquidityETH(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;

    poolId(overrides?: CallOverrides): Promise<BigNumber>;

    stargateEthVault(overrides?: CallOverrides): Promise<BigNumber>;

    stargateRouter(overrides?: CallOverrides): Promise<BigNumber>;

    swapETHAndCall(
      _dstChainId: BigNumberish,
      _refundAddress: string,
      _toAddress: BytesLike,
      _swapAmount: RouterETH.SwapAmountStruct,
      _lzTxParams: IStargateRouter.LzTxObjStruct,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addLiquidityETH(
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    poolId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stargateEthVault(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    stargateRouter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    swapETHAndCall(
      _dstChainId: BigNumberish,
      _refundAddress: string,
      _toAddress: BytesLike,
      _swapAmount: RouterETH.SwapAmountStruct,
      _lzTxParams: IStargateRouter.LzTxObjStruct,
      _payload: BytesLike,
      overrides?: PayableOverrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
