export function getQueryString(url: URL): string {
	const queryParams = new URLSearchParams({ limit: '10' });
	const page = url.searchParams.get('page') ?? '1';
	queryParams.set('page', page);
	return queryParams.toString();
}
