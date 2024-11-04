export default async function getFormFetcherResponse<T>(response: Response): Promise<T> {
    return new Response(response.body).json().then((res: T) => res);
}
