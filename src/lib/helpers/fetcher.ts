import axios from 'axios';

export async function getFetcher(url: string) {
    const response = await axios.get(url);
    return response.data;
}

export async function postFetcher<T>(url: string, data?: Record<string, object> | FormData): Promise<T> {
    const response = await axios.post<T>(url, data);
    return response.data;
}
