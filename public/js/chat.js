document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");
  const voiceBtn = document.getElementById("voice-btn");

  // Submit text messages
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;

    displayUserMessage(message);
    input.value = "";
    await sendToBot(message);
  });

  // Voice recognition
  // voiceBtn.addEventListener("click", () => {
  //   if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
  //     alert("Your browser does not support voice recognition.");
  //     return;
  //   }

  //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  //   const recognition = new SpeechRecognition();
  //   recognition.lang = 'en-US';
  //   recognition.interimResults = false;
  //   recognition.maxAlternatives = 1;

  //   recognition.start();
  //   voiceBtn.style.background = "#d9dde147"; // show active

  //   recognition.onresult = async (event) => {
  //     const transcript = event.results[0][0].transcript;
  //     displayUserMessage(transcript); // display as user message
  //     await sendToBot(transcript);    // send to bot
  //   };

  //   recognition.onerror = (event) => {
  //     console.error("Speech recognition error:", event.error);
  //   };

  //   recognition.onend = () => {
  //     voiceBtn.style.background = "#e6e7e83c"; // reset button
  //   };
  // });

  // Display user message
  function displayUserMessage(msg) {
    chatBox.innerHTML += `<div class="message user-message">${msg}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Display bot message + typing + speak
  async function sendToBot(message) {
    // Typing indicator
    const typingEl = document.createElement("div");
    typingEl.className = "typing";
    typingEl.textContent = "ConvoCore♾️ is typing...";
    chatBox.appendChild(typingEl);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate delay

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      typingEl.remove();

      chatBox.innerHTML += `<div class="message bot-message">${data.reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      // Speech synthesis
      // const utter = new SpeechSynthesisUtterance(data.reply);
      // utter.lang = 'en-US';
      // window.speechSynthesis.speak(utter);

    } catch (err) {
      typingEl.remove();
      chatBox.innerHTML += `<div class="message bot-message error">⚠️ ${err.message}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }
});
