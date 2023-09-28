export async function apiCall (url, apiOptions) {
    const response = await fetch(url, apiOptions);
    const result = await response.json();
    return(result);
};