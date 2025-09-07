import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const PORT = 3000;

// For ES Modules (__dirname simulation)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ------------------
// 🔹 In-memory users (temporary)
// ------------------
const users = [];


app.post("/api/signup", async (req, res) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();
  password = password.trim();

  if (!email || !password) {
    return res.json({ success: false, message: "Email and password required" });
  }

  if (users.find(u => u.email === email)) {
    return res.json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.json({ success: true, message: "Signup successful" });
});

// Login (with bcrypt.compare)
app.post("/api/login", async (req, res) => {
  let { email, password } = req.body;

  email = email.trim().toLowerCase();
  password = password.trim();

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.json({ success: false, message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Login successful" });
});



// ------------------
// 🔹 Chat (AI reply)
// ------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({ reply: `Echo: ${message}` });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "⚠️ Error with AI response" });
  }
});

// ------------------
// Start server
// ------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
