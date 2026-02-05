const express = require("express");
const webpush = require("web-push");

const app = express();

// ✅ CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.json());

// 🔑 VAPID KEYS
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

webpush.setVapidDetails(
  "mailto:tothbtango@gmail.com",
  PUBLIC_KEY,
  PRIVATE_KEY
);

const subs = new Set();

app.post("/subscribe", (req, res) => {
  subs.add(JSON.stringify(req.body));
  console.log("New subscriber");
  res.sendStatus(201);
});

app.post("/notify", async (req, res) => {
  for (const s of subs) {
    await webpush.sendNotification(
      JSON.parse(s),
      JSON.stringify({
        title: "Button clicked",
        body: "Someone pressed a button"
      })
    );
  }
  res.sendStatus(200);
});

// 🔥 IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Push server running on port", PORT);
});
