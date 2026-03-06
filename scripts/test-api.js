async function run() {
    try {
        const res = await fetch("https://expo.conectamt.mx/api/embeddings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "18933b91-5360-4416-bdfe-ca2569527ec5" }) // Just a random UUID
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Body:", text);
    } catch (e) {
        console.error(e);
    }
}
run();
