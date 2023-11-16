import Root from './card.svelte';
import Content from './card-content.svelte';
import Description from './card-description.svelte';
import Footer from './card-footer.svelte';
import Header from './card-header.svelte';
import Title from './card-title.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

export const cardVariants = tv({
	base: 'rounded-3xl bg-card text-card-foreground shadow-md ',
	variants: {
		variant: {
			default: '',
			popover: 'bg-popover'
		},
		padding: {
			default: '',
			base: 'px-4 py-2'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
});

export type Variant = VariantProps<typeof cardVariants>['variant'];

export {
	Root,
	Content,
	Description,
	Footer,
	Header,
	Title,
	//
	Root as Card,
	Content as CardContent,
	Description as CardDescription,
	Footer as CardFooter,
	Header as CardHeader,
	Title as CardTitle
};

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
