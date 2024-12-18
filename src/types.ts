export interface Geolocation {
	lat: number;
	long: number;
}

export interface Address {
	city: string;
	street: string;
	number: string;
	zipcode: string;
	geolocation: Geolocation;
}

export interface Name {
	firstname: string;
	lastname: string;
}

export interface User {
	id: number;
	email: string;
	username: string;
	password: string;
	name: Name;
	address: Address;
	phone: string;
}

export interface PaginationParams {
	limit?: number;
	starting_after?: number;
	ending_before?: number;
	page?: number;
	[key: string]: unknown;
}

export interface PaginationState {
	currentPage: number;
	isNextPage: boolean;
	isPreviousPage: boolean;
}

export type Direction = 'next' | 'prev';

export interface Product {
	id: number;
	title: string;
	image: string;
	price: number;
	description: string;
	brand: string;
	model: string;
	color: string;
	category: string;
	discount: number;
}
