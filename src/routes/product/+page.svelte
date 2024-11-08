<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Table from '$lib/components/Table.svelte';
	import type { PaginationParams, Product } from '../../types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const products = $derived(data.products);

	let firstId = $derived(products.length > 0 ? products[0].id : undefined);
	let lastId = $derived(products.length > 0 ? products[products.length - 1].id : undefined);

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
				page
			});
		}
	});
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
		<p class="join-item">Ending before: <span class="font-medium text-success">{firstId}</span></p>
		<p class="join-item">Starting after: <span class="font-medium text-success">{lastId}</span></p>
	</div>

	<Table data={products} onNext={handleNextPage} onPrev={handlePrevPage} {page}>
		{#snippet header()}
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

		{#snippet row(product: Product)}
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
