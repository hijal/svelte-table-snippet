import { getQueryString } from '$lib/util/pagination';
import type { User } from '../../types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	try {
		const response = await fetch(`https://fakestoreapi.in/api/users?${getQueryString(url)}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch users: HTTP status ${response.status}`);
		}

		const data = await response.json();
		const users: User[] = data.users;

		return {
			users
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
};
