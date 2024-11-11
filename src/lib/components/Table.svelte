<script lang="ts" module>
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type T = Record<string, any>;
</script>

<script lang="ts" generics="T extends Record<string, any>">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { Direction, PaginationParams, PaginationState } from '../../types';

	interface Props {
		tableData: T[];
		tableHeader: Snippet;
		tableRow: Snippet<[T]>;
		paginationParams?: Partial<PaginationParams>;
		onPreviousPage: () => Promise<void> | void;
		onNextPage: () => Promise<void> | void;
	}

	const { tableData, tableHeader, tableRow, paginationParams, onPreviousPage, onNextPage }: Props =
		$props();

	const paginationState = $state<PaginationState>({
		currentPage: +(paginationParams?.page || 1),
		isNextPage: false,
		isPreviousPage: false
	});

	async function updatePaginationUrl(updatedParams: Partial<PaginationParams>) {
		const currentUrl = new URL(window.location.href);
		const urlParams = new URLSearchParams();

		const mergedParams = {
			...updatedParams,
			ending_before: paginationState.isNextPage ? undefined : updatedParams.ending_before,
			starting_after: paginationState.isPreviousPage ? undefined : updatedParams.starting_after
		};

		Object.entries(mergedParams).forEach(([paramKey, paramValue]) => {
			if (paramValue !== undefined) {
				urlParams.set(paramKey, paramValue.toString());
			}
		});

		currentUrl.search = urlParams.toString();
		await goto(currentUrl.toString(), { replaceState: true });
	}

	async function handlePageNavigation(navigationDirection: Direction): Promise<void> {
		const isNavigatingNext = navigationDirection === 'next';

		paginationState.currentPage = isNavigatingNext
			? paginationState.currentPage + 1
			: paginationState.currentPage - 1;

		paginationState.isNextPage = isNavigatingNext;
		paginationState.isPreviousPage = !isNavigatingNext;

		await (isNavigatingNext ? onNextPage() : onPreviousPage());
	}

	function handleKeyboardNavigation(event: KeyboardEvent) {
		const isFirstPage = paginationState.currentPage === 1;
		const isLastPage = paginationState.currentPage >= 5;

		if (event.key === 'ArrowRight' && !isLastPage) {
			handlePageNavigation('next');
		} else if (event.key === 'ArrowLeft' && !isFirstPage) {
			handlePageNavigation('prev');
		}
	}

	$effect(() => {
		const isFirstPage = paginationState.currentPage <= 1;

		if (isFirstPage) {
			goto(window.location.pathname, { replaceState: true });
		} else {
			updatePaginationUrl({
				page: paginationState.currentPage,
				...paginationParams
			});
		}
	});
</script>

<svelte:window on:keydown={handleKeyboardNavigation} />

<div class="table-container overflow-x-auto">
	<table class="table table-zebra">
		<thead>
			<tr class="table-header bg-gray-200 text-gray-700">{@render tableHeader()}</tr>
		</thead>

		<tbody>
			{#each tableData as rowData}
				<tr class="table-row border-b hover:bg-gray-50">{@render tableRow(rowData)}</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="pagination-controls join flex items-center justify-end">
	<div class="pagination-info flex items-center gap-2">
		<span>Page {paginationState?.currentPage}</span>
		<div class="pagination-buttons join flex items-center gap-2">
			<button
				type="button"
				class="pagination-button btn btn-sm rounded-md {paginationState.currentPage === 1
					? 'btn-disabled'
					: ''}"
				onclick={() => handlePageNavigation('prev')}
				aria-label="Previous page"
			>
				<ArrowLeft size={16} />
			</button>
			<button
				type="button"
				class="pagination-button btn btn-sm rounded-md {paginationState.currentPage === 5
					? 'btn-disabled'
					: ''}"
				onclick={() => handlePageNavigation('next')}
				aria-label="Next page"
			>
				<ArrowRight size={16} />
			</button>
		</div>
	</div>
</div>
