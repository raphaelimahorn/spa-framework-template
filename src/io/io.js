export async function loadJsonAsync(path, handler) {
    const response = await fetch(path, {cache: "no-cache"});

    if (!response.ok) {
        handler ??= console.warn;
        handler(response);
        return;
    }

    return await JSON.parse(await response.text());
}

export async function loadHtmlAsync(path, handler) {
    const response = await fetch(path);

    if (!response.ok) {
        handler ??= console.warn;
        handler(response);
        return;
    }

    return await response.text();
}