function isConnected() {
    const token = sessionStorage.getItem("token")
    return token !== null && token !== ""; // Vérifier si le jeton existe et n'est pas vide
}

const logOut = document.getElementById("logoutBtn");
const logIn = document.getElementById("loginBtn");
const editionBar = document.querySelector(".editionBar")
const editionBtn = document.querySelector(".modalBtn")
const filter = document.querySelector(".filter")

// Fonction pour mettre à jour l'affichage des boutons de connexion/déconnexion
function updateButtonDisplay() {
    // Utilisation de l'opérateur ternaire qui determine l'affichage des elements en fonction du statut de connexion   
    logIn.style.display = isConnected() ? "none" : "block";
    logOut.style.display = isConnected() ? "block" : "none";
    editionBar.style.display = isConnected() ? "flex" : "none";
    editionBtn.style.display = isConnected() ? "flex" : "none";
    filter.style.display = isConnected() ? "none" : "flex";
}

// Appelez la fonction lors du chargement de la page
updateButtonDisplay();


// Ajoutez un écouteur d'événements pour le bouton de déconnexion
logOut.addEventListener("click", (event) => {
    event.preventDefault();
    sessionStorage.removeItem("token");
    window.location.replace("index.html");
});

