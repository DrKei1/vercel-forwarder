const TARGET_HOST = "77.68.22.95";
const TARGET_PORT = "10003";
const TARGET_PATH = "/hu";

export default async function handler(req, res) {
  const targetUrl = `http://${TARGET_HOST}:${TARGET_PORT}${TARGET_PATH}`;

  const headers = { ...req.headers };
  delete headers["host"];
  headers["host"] = TARGET_HOST;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : null,
      duplex: "half",
    });

    res.status(response.status);

    for (const [key, value] of response.headers.entries()) {
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    }

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }

    res.end();

  } catch (err) {
    res.status(502).send(`Error: ${err.message}`);
  }
}

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};