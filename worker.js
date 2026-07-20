const MAX_ENTRIES = 10;
const MAX_NAME_LENGTH = 20;

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/api/scores" && request.method === "GET") {
            return getScores(env);
        }

        if (url.pathname === "/api/scores" && request.method === "POST") {
            return addScore(request, env);
        }

        return env.ASSETS.fetch(request);
    }
};

async function getScores(env) {
    const scores = await loadScores(env);
    return jsonResponse(scores);
}

async function addScore(request, env) {
    const body = await request.json();
    const name = String(body.name).slice(0, MAX_NAME_LENGTH);
    const attempts = Number(body.attempts);

    if (name.length === 0 || !Number.isInteger(attempts) || attempts < 1) {
        return jsonResponse({ error: "Invalid score data" }, 400);
    }

    const scores = await loadScores(env);
    scores.push({ name, attempts });
    scores.sort((a, b) => a.attempts - b.attempts);
    const topScores = scores.slice(0, MAX_ENTRIES);

    await env.LEADERBOARD.put("scores", JSON.stringify(topScores));

    return jsonResponse(topScores);
}

async function loadScores(env) {
    const stored = await env.LEADERBOARD.get("scores");
    return stored === null ? [] : JSON.parse(stored);
}

function jsonResponse(data, status) {
    return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: { "Content-Type": "application/json" }
    });
}
