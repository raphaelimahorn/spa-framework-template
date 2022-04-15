export async function loadJsonAsync(path, handler) {
    const response = await fetch(path, {cache: "no-cache"});

    if (!response.ok) {
        handler(response);
    }

    return await JSON.parse(await response.text());
}

export async function loadHtmlAsync(path, handler) {
    const response = await fetch(path);

    if (!response.ok) {
        handler(response);
    }

    return await response.text();
}