const REQUEST_TIMEOUT = 10000;

export async function httpClient<T>(url: string, options: RequestInit = {}): Promise<T | null> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const headers = new Headers(options.headers || {});
    
    const token = localStorage.getItem("token");
    
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    
    try {
        const response = await fetch(url, {
            ...options,
            headers, 
            signal: controller.signal,
        });
        clearTimeout(id);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const details = errorData.details ? `: ${JSON.stringify(errorData.details)}` : '';
            const errorMessage = errorData.message || `Помилка: ${response.status}${details}`;
            throw new Error(errorMessage);
        }
        
        if (response.status === 204) return null;
        
        const json = await response.json();
        return (json.data !== undefined ? json.data : json) as T; 
        
    } catch (error: unknown) { 
        if (error instanceof Error) {
            if (error.name === 'AbortError') throw new Error("Час очікування вичерпано");
            throw error; 
        }
        throw new Error("Невідома помилка"); 
    }
}