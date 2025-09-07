# ConvoCore - Chat Enabled

## Run
1. Ensure Node.js 18+ is installed.
2. Create a `.env` file (already present) with:
```
PORT=3000
GEMINI_API_KEY=YOUR_KEY_HERE
# Optional:
GEMINI_MODEL=gemini-1.5-flash
```
3. Install deps:
```
npm install
```
4. Start:
```
npm start
```
5. Open http://localhost:3000 and use the chat box.

## Files Modified
- server.js — complete Express server with `/api/chat` using Gemini SDK
- public/js/chat.js — sends chat messages to backend
- public/convocore.html — chat UI injected and script included
