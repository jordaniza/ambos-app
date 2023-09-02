<script lang="ts">
	export let isSafe = true;
	let theme = 'dark';
</script>

<div
	class={`rounded-md w-1/6 text-sm text-center border font-bold
          ${
						theme === 'dark'
							? /* dark mode */
							  isSafe
								? 'border-green-500 text-green-500'
								: 'border-red-500 text-red-500'
							: /* light mode */
							isSafe
							? 'border-green-600 text-green-600'
							: 'border-red-600 text-red-600'
					}
      `}
>
	{isSafe ? 'Safe' : 'At Risk'}
</div>
