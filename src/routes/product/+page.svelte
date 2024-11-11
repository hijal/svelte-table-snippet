<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Table from '$lib/components/Table.svelte';
	import type { PaginationParams, Product } from '../../types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const products = $derived(data.products);

	const ending_before = $derived(products.length > 0 ? products[0].id : undefined);
	const starting_after = $derived(
		products.length > 0 ? products[products.length - 1].id : undefined
	);

	const params: PaginationParams = $derived({
		ending_before,
		starting_after
	});

	function handleNextPage() {
		console.log('next page');
	}
	function handlePrevPage() {
		console.log('prev page');
	}
</script>

<div class="space-y-10 p-6">
	<div class="flex items-center justify-between">
		<h1 class="text-4xl font-bold text-gray-900">Product page</h1>
		<button
			onclick={() => history.back()}
			class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
		>
			<ArrowLeft class="mr-2" strokeWidth={1.5} size={17} />
			Back
		</button>
	</div>

	<div class="join flex flex-col flex-wrap">
		<p class="join-item">
			Ending before: <span class="font-medium text-success">{ending_before}</span>
		</p>
		<p class="join-item">
			Starting after: <span class="font-medium text-success">{starting_after}</span>
		</p>
	</div>

	<Table
		tableData={products}
		paginationParams={params}
		onNextPage={handleNextPage}
		onPreviousPage={handlePrevPage}
	>
		{#snippet tableHeader()}
			<th class="p-4">ID</th>
			<th class="p-4">Title</th>
			<th class="p-4">Image</th>
			<th class="p-4">Price</th>
			<th class="p-4">Description</th>
			<th class="p-4">Brand</th>
			<th class="p-4">Model</th>
			<th class="p-4">Color</th>
			<th class="p-4">Category</th>
			<th class="p-4">Discount</th>
		{/snippet}

		{#snippet tableRow(product)}
			<td class="p-4">{product.id}</td>
			<td class="p-4">{product.title}</td>
			<td class="p-4"
				><img src={product.image} alt={product.title} class="h-auto w-36 object-cover" /></td
			>
			<td class="p-4">${product.price.toFixed(2)}</td>
			<td class="line-clamp-1 p-4">
				{product.description.length > 100
					? `${product.description.slice(0, 100)}...`
					: product.description}
			</td>
			<td class="p-4">{product.brand}</td>
			<td class="p-4">{product.model}</td>
			<td class="p-4">{product.color}</td>
			<td class="p-4">{product.category}</td>
			<td class="p-4">{product.discount}%</td>
		{/snippet}
	</Table>
</div>
