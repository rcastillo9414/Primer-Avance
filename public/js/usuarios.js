document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("createUserForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: form.role.value
    };

    const token = localStorage.getItem("token");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(body)
    });

    const json = await res.json();

    if (res.ok) {
      alert("Usuario creado correctamente");
      form.reset();
    } else {
      alert(json.msg || json.error || "No se pudo crear el usuario");
    }
  });

});
