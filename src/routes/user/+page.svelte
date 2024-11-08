<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Table from '$lib/components/Table.svelte';
	import type { PaginationParams, User } from '../../types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const users = $derived(data.users);

	let firstId = $derived(users.length > 0 ? users[0].id : undefined);
	let lastId = $derived(users.length > 0 ? users[users.length - 1].id : undefined);

	let page = $state.raw(1);

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
		<h1 class="text-4xl font-bold text-gray-900">User page</h1>
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

	<Table data={users} onNext={handleNextPage} onPrev={handlePrevPage} {page}>
		{#snippet header()}
			<th class="p-4">ID</th>
			<th class="p-4">Email</th>
			<th class="p-4">Username</th>
			<th class="p-4">Password</th>
			<th class="p-4">First Name</th>
			<th class="p-4">Last Name</th>
			<th class="p-4">City</th>
			<th class="p-4">Street</th>
			<th class="p-4">Number</th>
			<th class="p-4">Zip Code</th>
			<th class="p-4">Latitude</th>
			<th class="p-4">Longitude</th>
			<th class="p-4">Phone</th>
		{/snippet}

		{#snippet row(user: User)}
			<td class="p-4">{user.id}</td>
			<td class="p-4">{user.email}</td>
			<td class="p-4">{user.username}</td>
			<td class="p-4">{user.password}</td>
			<td class="p-4">{user.name.firstname}</td>
			<td class="p-4">{user.name.lastname}</td>
			<td class="p-4">{user.address.city}</td>
			<td class="p-4">{user.address.street}</td>
			<td class="p-4">{user.address.number}</td>
			<td class="p-4">{user.address.zipcode}</td>
			<td class="p-4">{user.address.geolocation.lat}</td>
			<td class="p-4">{user.address.geolocation.long}</td>
			<td class="p-4">{user.phone}</td>
		{/snippet}
	</Table>
</div>
