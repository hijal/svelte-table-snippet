<script lang="ts" generics="T extends Record<string, any>">
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { PaginationParams } from '../../types';

	interface Props<T> {
		data: T[];
		header: Snippet;
		row: Snippet<[T]>;
		params?: Partial<PaginationParams>;
		onPrev: () => Promise<void> | void;
		onNext: () => Promise<void> | void;
	}

	let page = $state(+params?.page || 1);
	let isNext = $state(false);
	let isPrev = $state(false);

	const { header, row, data, params, onPrev, onNext }: Props<T> = $props();

	async function updateUrlParams(params: Partial<PaginationParams>) {
		const url = new URL(window.location.href);
		const currentParams = new URLSearchParams();

		if (isNext) {
			params.ending_before = undefined;
		}

		if (isPrev) {
			params.starting_after = undefined;
		}

		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined) {
				currentParams.set(key, value.toString());
			}
		});

		url.search = currentParams.toString();
		await goto(url.toString(), { replaceState: true });
	}

	async function handleNextPage() {
		page += 1;
		isNext = true;
		isPrev = false;
		await onNext();
	}

	async function handlePrevPage() {
		page -= 1;
		isNext = false;
		isPrev = true;
		await onPrev();
	}

	$effect(() => {
		if (page <= 1) {
			goto(window.location.pathname, { replaceState: true });
		} else {
			updateUrlParams({
				page,
				...params
			});
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' && page < 5) {
			handleNextPage();
		} else if (e.key === 'ArrowLeft' && page > 1) {
			handlePrevPage();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

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
