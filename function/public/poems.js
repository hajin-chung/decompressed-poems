document.querySelector("#dashboard-poem .save").onclick = async () => {
  const content = docuemnt.querySelector("#dashboard-poem .input").innerText;
  const res = await fetch(
    "https://api.deps.me/poem",
    { method: "POST", body: JSON.stringify({ content }) },
  );
  const data = await res.json();
  if (data.error) {
    console.error(data);
  }
};

const deleteButtons = [...document.querySelectorAll("#dashboard-poem .delete")];
deleteButtons.forEach((button) =>
  button.onclick = async () => {
    const res = await fetch(`https://api.deps.me/poem/${button.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.error) {
      console.error(data);
    }
  }
);
