<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PaginationParams } from '../../types';

	interface Props {
		data: any[];
		header: Snippet;
		row: Snippet<[any]>;
		starting_after?: number;
		ending_before?: number;
	}

	const {
		header,
		row,
		data,
		starting_after = $bindable(),
		ending_before = $bindable()
	}: Props = $props();
	let page = $state(1);

	async function updateUrlParams(params: Partial<PaginationParams>) {
		const url = new URL(window.location.href);
		const currentParams = new URLSearchParams();

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				currentParams.set(key, value.toString());
			}
		});

		url.search = currentParams.toString();
		await goto(url.toString(), { replaceState: true });
	}

	function handleNextPage() {
		page += 1;
	}

	function handlePrevPage() {
		page -= 1;
	}

	$effect(() => {
		if (page <= 1) {
			goto(window.location.pathname, { replaceState: true });
		} else {
			updateUrlParams({
				page,
				starting_after,
				ending_before
			});
		}
	});
</script>

<div class="overflow-x-auto">
	<table class="table table-zebra">
		<thead>
			<tr class="bg-gray-200 text-gray-700">{@render header()}</tr>
		</thead>

		<tbody>
			{#each data as item}
				<tr class="border-b hover:bg-gray-50">{@render row(item)}</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="join flex items-center justify-end">
	<div class="flex items-center gap-2">
		<span>Page {page}</span>
		<div class="join flex items-center gap-2">
			<button
				type="button"
				class="btn btn-sm rounded-md {page === 1 ? 'btn-disabled' : ''}"
				onclick={() => handlePrevPage()}
			>
				<ArrowLeft size={16} />
			</button>
			<button
				type="button"
				class="btn btn-sm rounded-md {page >= 5 ? 'btn-disabled' : ''}"
				onclick={() => handleNextPage()}
			>
				<ArrowRight size={16} />
			</button>
		</div>
	</div>
</div>
