const REQUEST_TIMEOUT = 10000;

export async function makeRequest(url, options = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            const details = errorData.details ? `: ${JSON.stringify(errorData.details)}` : '';
            const errorMessage = errorData.message || `Помилка: ${response.status}${details}`;

            if (response.status === 400) throw new Error(`Невалідні дані: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        if (response.status === 204) return null;

        const result = await response.json();
        return result.data || result;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') throw new Error("Час очікування вичерпано");
            throw error;
        }
        throw new Error("Виникла невідома помилка");
    }
}