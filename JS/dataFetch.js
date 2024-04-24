export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        } else {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}