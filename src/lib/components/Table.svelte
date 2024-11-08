<script lang="ts">
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		page: number;
		data: any[];
		header: Snippet;
		row: Snippet<[any]>;
		onNext: () => void;
		onPrev: () => void;
	}

	let { page = $bindable(), header, row, data, onNext, onPrev }: Props = $props();

	function handleNextPage() {
		onNext();
	}

	function handlePrevPage() {
		onPrev();
	}
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
