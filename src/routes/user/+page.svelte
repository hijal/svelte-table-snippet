<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import Table from '$lib/components/Table.svelte';
	import type { PaginationParams } from '../../types';

	interface Props {
		data: PageData;
	}

	const { data }: Props = $props();
	const users = $derived(data.users);

	const ending_before = $derived(users.length > 0 ? users[0].id : undefined);
	const starting_after = $derived(users.length > 0 ? users[users.length - 1].id : undefined);

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
		<p class="join-item">
			Ending before: <span class="font-medium text-success">{ending_before}</span>
		</p>
		<p class="join-item">
			Starting after: <span class="font-medium text-success">{starting_after}</span>
		</p>
	</div>

	<Table
		tableData={users}
		paginationParams={params}
		onNextPage={handleNextPage}
		onPreviousPage={handlePrevPage}
	>
		{#snippet tableHeader()}
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

		{#snippet tableRow(user)}
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
