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
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface FaucetInterface extends utils.Interface {
  functions: {
    "MAX_MINT_AMOUNT()": FunctionFragment;
    "isMintable(address)": FunctionFragment;
    "isPermissioned()": FunctionFragment;
    "mint(address,address,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setMintable(address,bool)": FunctionFragment;
    "setPermissioned(bool)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "transferOwnershipOfChild(address[],address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "MAX_MINT_AMOUNT"
      | "isMintable"
      | "isPermissioned"
      | "mint"
      | "owner"
      | "renounceOwnership"
      | "setMintable"
      | "setPermissioned"
      | "transferOwnership"
      | "transferOwnershipOfChild"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "MAX_MINT_AMOUNT",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isMintable", values: [string]): string;
  encodeFunctionData(
    functionFragment: "isPermissioned",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMintable",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setPermissioned",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnershipOfChild",
    values: [string[], string]
  ): string;

  decodeFunctionResult(
    functionFragment: "MAX_MINT_AMOUNT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isMintable", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isPermissioned",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMintable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPermissioned",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnershipOfChild",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface Faucet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: FaucetInterface;

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
    MAX_MINT_AMOUNT(overrides?: CallOverrides): Promise<[BigNumber]>;

    isMintable(asset: string, overrides?: CallOverrides): Promise<[boolean]>;

    isPermissioned(overrides?: CallOverrides): Promise<[boolean]>;

    mint(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setMintable(
      asset: string,
      active: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    setPermissioned(
      permissioned: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;

    transferOwnershipOfChild(
      childContracts: string[],
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<ContractTransaction>;
  };

  MAX_MINT_AMOUNT(overrides?: CallOverrides): Promise<BigNumber>;

  isMintable(asset: string, overrides?: CallOverrides): Promise<boolean>;

  isPermissioned(overrides?: CallOverrides): Promise<boolean>;

  mint(
    token: string,
    to: string,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setMintable(
    asset: string,
    active: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  setPermissioned(
    permissioned: boolean,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  transferOwnershipOfChild(
    childContracts: string[],
    newOwner: string,
    overrides?: Overrides & { from?: string }
  ): Promise<ContractTransaction>;

  callStatic: {
    MAX_MINT_AMOUNT(overrides?: CallOverrides): Promise<BigNumber>;

    isMintable(asset: string, overrides?: CallOverrides): Promise<boolean>;

    isPermissioned(overrides?: CallOverrides): Promise<boolean>;

    mint(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setMintable(
      asset: string,
      active: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setPermissioned(
      permissioned: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnershipOfChild(
      childContracts: string[],
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
  };

  estimateGas: {
    MAX_MINT_AMOUNT(overrides?: CallOverrides): Promise<BigNumber>;

    isMintable(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    isPermissioned(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setMintable(
      asset: string,
      active: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    setPermissioned(
      permissioned: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;

    transferOwnershipOfChild(
      childContracts: string[],
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    MAX_MINT_AMOUNT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isMintable(
      asset: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isPermissioned(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mint(
      token: string,
      to: string,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setMintable(
      asset: string,
      active: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    setPermissioned(
      permissioned: boolean,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;

    transferOwnershipOfChild(
      childContracts: string[],
      newOwner: string,
      overrides?: Overrides & { from?: string }
    ): Promise<PopulatedTransaction>;
  };
}
