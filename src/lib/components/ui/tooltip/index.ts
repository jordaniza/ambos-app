import { Tooltip as TooltipPrimitive } from 'bits-ui';
import Content from './tooltip-content.svelte';
import TooltipIcon from './tooltip-icon.svelte';

const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;

export {
	Root,
	Trigger,
	Content,
	TooltipIcon,
	//
	Root as Tooltip,
	Content as TooltipContent,
	Trigger as TooltipTrigger
};
