// Signup
async function signup() {
  const email = document.getElementById("signup-email").value;
  const pass = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (pass !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  });

  const data = await res.json();
  alert(data.message);
  if (data.success) window.location.href = "login.html";
}

// Login
async function login() {
  const email = document.getElementById("login-email").value;
  const pass = document.getElementById("login-password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  });

  const data = await res.json();
  alert(data.message);
  if (data.success) window.location.href = "convocore.html";
}
