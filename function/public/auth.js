document.querySelector(".submit").onclick = async () => {
  const password = docuemnt.querySelector(".auth");
  const res = await fetch("https://api.deps.me/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (data.error) {
    console.error(data);
  }
};
