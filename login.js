const urlLogin = "http://localhost:5678/api/users/login";
const errorLogin = document.querySelector(".msgError")

function userLogin() {
    const formulaire = document.querySelector(".login");
    formulaire.addEventListener("submit", function (event) {
        event.preventDefault();
        
        // Récupérez les valeurs des champs
        const emailValue = document.getElementById("email").value;
        const passwordValue = document.getElementById("password").value;

        // Verifie si les champs sont vides 

        if (emailValue === "" || passwordValue === "") {
            errorLogin.style.display = "flex";
            return;
          } else {
            errorLogin.style.display = "none";      
        }

        const user = {
            email: emailValue,
            password: passwordValue,
        };

        // Convertissez l'objet en JSON

        const chargeUtile = JSON.stringify(user);
        
        // Envoi de la requête fetch
        fetch(urlLogin, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
            },
            body: chargeUtile,
        })
        .then(response => response.json())
        .then(data => {
            const token = data.token;
            sessionStorage.setItem("token", token);
            if (data.token) {
                window.location = "index.html";
            } else {
                errorLogin.style.display ="flex";
            }
        })
        .catch(error => {
            console.error("Erreur:", error.message);
            alert("Erreur lors de la connexion. Veuillez réessayer.");
        });
    });
}

// Appel de la fonction userLogin pour activer l'écouteur d'événements
userLogin();

