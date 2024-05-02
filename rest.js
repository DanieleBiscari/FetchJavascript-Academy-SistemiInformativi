/*
Questo file contiene tutte le chiamate REST al Database realizzato in Spring Boot e MySQL
@autor: Daniele Biscari
*/

// METODI DI UTILITA' //
async function refreshTable() {
  const tableBody = document.getElementById("table-body");
  const tableFoot = document.getElementById("table-foot");
  tableBody.innerHTML = "";
  tableFoot.innerHTML = "";
  setTimeout(getUtenti, 100);
}

function dataValidation(nome, cognome, email, password) {
  console.log(nome);
  if (!nome.match("[a-zA-Z\\s']{5,50}")) {
    const nome = document.getElementById("nome");
    nome.classList.add("is-invalid");
  }
  if (!cognome.match("[a-zA-Z\\s']{5,50}")) {
    const cognome = document.getElementById("cognome");
    cognome.classList.add("is-invalid");
  }
  if (!email.match("[A-Za-z0-9\\.\\+_-]+@[A-Za-z0-9\\._-]+\\.[A-Za-z]{2,24}")) {
    const email = document.getElementById("email");
    email.classList.add("is-invalid");
  }
  if (
    !password.match(
      "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,20}"
    )
  ) {
    const password = document.getElementById("password");
    password.classList.add("is-invalid");
  }
}

// GET DI TUTTI GLI UTENTI DAL DB //
async function getUtenti() {
  try {
    const response = await fetch("http://localhost:8080/api/utente/getUtenti");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const dati = await response.json();

    setUtentiInTable(dati);
  } catch (error) {
    console.error("Errore durante la chiamata REST:", error);
  }
}

function setUtentiInTable(dati) {
  dati.forEach((element, index) => {
    let ruoliText = "";

    const indice = document.createElement("th");
    const tr = document.createElement("tr");
    const nome = document.createElement("td");
    const cognome = document.createElement("td");
    const email = document.createElement("td");
    const ruoli = document.createElement("td");
    const tbody = document.getElementById("table-body");

    const iconContainer = document.createElement("td");
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("bi", "bi-trash", "fs-4", "iconAdminTable");
    trashIcon.addEventListener("click", () => deleteUtente(element.email));

    const editIcon = document.createElement("i");
    editIcon.classList.add("bi", "bi-pencil-square", "fs-4", "iconAdminTable");
    iconContainer.append(trashIcon, editIcon);

    indice.scope = "row";
    indice.textContent = index;
    nome.textContent = element.nome;
    cognome.textContent = element.cognome;
    email.textContent = element.email;
    element.ruoli.forEach((ruolo, index) => {
      ruoliText += ruolo.tipologia;
      if (Object.keys(element.ruoli).length > index + 1) {
        ruoliText += ", ";
      }
    });
    ruoli.textContent = ruoliText;

    tr.append(indice, nome, cognome, email, ruoli, iconContainer);
    tbody.appendChild(tr);
  });

  const tfoot = document.getElementById("table-foot");
  const trFooter = document.createElement("tr");
  const tdFooter = document.createElement("td");
  const addIcon = document.createElement("i");
  addIcon.classList.add(
    "bi",
    "bi-plus-circle",
    "fs-2",
    "flex-container-center"
  );

  tdFooter.appendChild(addIcon);
  tdFooter.colSpan = 6;
  tdFooter.classList.add("td-footer");
  tdFooter.setAttribute("data-toggle", "modal");
  tdFooter.setAttribute("data-target", "#modalCenter");
  trFooter.appendChild(tdFooter);
  tfoot.appendChild(trFooter);
}

// POST DI UN NUOVO UTENTE NEL DB //
const formSubmit = document.getElementById("formSubmit");
formSubmit?.addEventListener("click", async (e) => {
  e.preventDefault();
  createNewUser();
});

async function createNewUser() {
  await createNewUserFetch();
  await refreshTable();
}
async function createNewUserFetch() {
  const form = document.getElementById("createUserForm");
  const formData = new FormData(form);
  const nome = formData.get("nome");
  const cognome = formData.get("cognome");
  const email = formData.get("email");
  const password = formData.get("password");

  dataValidation(nome, cognome, email, password);

  fetch("http://localhost:8080/api/utente/registrazione", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      cognome: cognome,
      email: email,
      password: password,
    }),
  }).catch((error) => console.error("Errore:", error));
}

// DELETE DI UN NUOVO UTENTE NEL DB //
async function deleteUtente(email) {
  await deleteUtenteFetch(email);
  await refreshTable();
}

async function deleteUtenteFetch(email) {
  fetch(`http://localhost:8080/api/utente/elimina/${email}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      cognome: cognome,
      email: email,
      password: password,
    }),
  }).catch((error) => console.error("Errore:", error));
}

const loginSubmit = document.getElementById("loginSubmit");
loginSubmit?.addEventListener("click", async (e) => {
  e.preventDefault();
  loginUtente();
});
async function loginUtente() {
  const form = document.getElementById("loginForm");
  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");
  // validazione dell'email e la password
  fetch("http://localhost:8080/api/utente/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
  .then(response =>response.json())
  .then(() => {
    // todo: controllare se il token è valido e verificare che il ruolo sia admin.
    window.location.href = "admin.html"
  })
  .catch((error) => console.error("Errore:", error));
}
