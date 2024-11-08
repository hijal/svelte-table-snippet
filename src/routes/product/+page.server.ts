import { getQueryString } from '$lib/util/pagination';
import type { Product } from '../../types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	try {
		const response = await fetch(`https://fakestoreapi.in/api/products?${getQueryString(url)}`);

		if (!response.ok) {
			throw new Error(`Failed to fetch users: HTTP status ${response.status}`);
		}

		const data = await response.json();
		const products: Product[] = data.products;

		return {
			products
		};
	} catch (error) {
		console.error(error);
		throw error;
	}
};
