const REQUEST_TIMEOUT = 10000;
export async function httpClient(url, options = {}) {
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
            if (response.status === 400)
                throw new Error(`Невалідні дані: ${errorMessage}`);
            if (response.status === 404)
                throw new Error("Ресурс не знайдено");
            if (response.status >= 500)
                throw new Error("Помилка на сервері");
            throw new Error(errorMessage);
        }
        if (response.status === 204)
            return null;
        const json = await response.json();
        return json.data;
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError')
                throw new Error("Час очікування відповіді вичерпано");
            throw error;
        }
        throw new Error("Невідома помилка");
    }
}
