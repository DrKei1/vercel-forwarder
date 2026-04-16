export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const chunks = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = Buffer.concat(chunks);

    const response = await fetch("http://77.68.22.95:8080", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: body,
    });

    const arrayBuffer = await response.arrayBuffer();

    res.status(200).send(Buffer.from(arrayBuffer));
  } catch (e) {
    console.error(e);
    res.status(500).send("error");
  }
}
