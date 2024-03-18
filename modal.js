import { createDocumentWorks } from "./index.js";
const worksUrl = 'http://localhost:5678/api/works';

// Variable pour ouvrir et fermer le modal de la gallery

const openModalButton = document.querySelector(".modalBtn");
const modal = document.querySelector(".modal");
const modalGallery = document.querySelector(".modal-wrapper");
const closeModalButtons = document.querySelectorAll(".closeModal");
const modalAdd = document.querySelector(".modal-add");

// Function pour afficher et fermer la modal

function openModal() {
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
}

modalGallery.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
modalAdd.addEventListener('click', (e) => {
    e.stopPropagation();
  });

openModalButton.addEventListener("click", function() {
    openModal();
});

closeModalButtons.forEach(closeButton => {
    closeButton.addEventListener("click", function() {
        closeModal();
    });
});

// Function pour fermer au click en dehors de la fenetre de modal

document.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Variable pour ouvrir et fermer le modal d'ajout de photo 

const btnAdd = document.getElementById("btnAddWork");
const btnReturn = document.querySelector(".returnGallery");

// Function pour ouvrir et fermer le modal d'ajout de photo 

btnAdd.addEventListener("click", function() {
    modalGallery.style.display = "none";
    modalAdd.style.display = "block";
})

btnReturn.addEventListener("click", function() {
    modalGallery.style.display = 'flex';
    modalAdd.style.display = 'none';
})

// Function pour generer les travaux dans le modal et ajouter l'icone de suppression 
const modalContent = document.querySelector('.modal-content');

function createDocumentWorksInModal(works) {
    const fragment = document.createDocumentFragment();
    const figure = document.createElement('figure');
    const division = document.createElement('div');
    const img = document.createElement('img');
    const iconeDel = document.createElement("i");

    img.src = works.imageUrl;
    
    fragment.appendChild(figure);
    figure.appendChild(division);
    division.appendChild(img);
    division.appendChild(iconeDel);

    iconeDel.classList.add('fa-solid', 'fa-trash-can');
    division.classList.add("modal-article");

    iconeDel.addEventListener("click", (event) => {
        event.preventDefault();
        deleteWork(works.id, figure);
    });

    return(figure)
}

function getWorksModal() {   
    fetch(worksUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            data.forEach((works) => {
                const figure = createDocumentWorksInModal(works);
                modalContent.appendChild(figure);
            });
        })
        .catch(function (error) {
            console.log(error); //Ajout d'une gestion d'erreur dans la requête fetch
        });
}
  
getWorksModal();


// Function pour supprimer des travaux a partir du modal

function deleteWork(workId, figureElement) {
    const token = sessionStorage.getItem("token");
    const deleteUrl = `http://localhost:5678/api/works/${workId}`;

    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error (`La suppression du travail a échoué.`);
        }
        if (figureElement) {
            figureElement.remove();
        }
        const removeGallery = document.querySelector(`figure[data-id="${workId}"]`);
        if(removeGallery) {
            removeGallery.remove();
        }
        
    })
    .catch(error => {
        console.error('Erreur lors de la suppression du travail:', error);
    });
}

// Récupération des categorie pour le formulaire

const categorieAdd = document.getElementById("modal-categorie");
const categoriesUrl = 'http://localhost:5678/api/categories';

function getCategoriesAdd() {
    fetch(categoriesUrl)
    .then((response) => response.json()
    .then((data) => {
        data.forEach((category) => {
            const categoryOption = document.createElement("option");
            // Attribution de la valeur et du texte de l'option
            categoryOption.value = category.id;
            categoryOption.textContent = category.name;
            
            categorieAdd.appendChild(categoryOption);
        })
    })
    )
}

getCategoriesAdd();

// Verification que tout les champs necessaire sont bien remplis

const imageInput = document.getElementById("imageInput");
const titleInput = document.getElementById("titleInput");
const categorieInput = document.getElementById("modal-categorie");
const submitBtn = document.getElementById("submit-projet");

function checkInput() {
    if(imageInput.files.length === 0 || titleInput.value == '' || categorieInput.value == '') {
        submitBtn.style.backgroundColor = "#A7A7A7";
        submitBtn.disabled = true;
    } else {
        submitBtn.style.backgroundColor = "";
        submitBtn.disabled = false;
    }
}

checkInput();

// Appel de la fonction checkInput a chaque changement de valeur dans l'une des trois zone a vérifier 

titleInput.addEventListener('input', checkInput);
imageInput.addEventListener('change', checkInput);
categorieInput.addEventListener('change', checkInput);

// Function pour ajouter un travail 



function addWork (event) {
    event.preventDefault()
    const token = sessionStorage.getItem("token");
    const addWorkUrl = "http://localhost:5678/api/works"

// Création des variable qui récupére les valeurs saisie

    const titleInput = document.getElementById("titleInput").value;
    const imageInput = document.getElementById("imageInput").files[0];
    const categorieInput = document.getElementById("modal-categorie").value;

// Message pour alerte si les champs sont tous rempli et si l'image est conforme

    if(titleInput == '' || imageInput == 0 || categorieInput == '') {
        alert("Veuillez remplir tout les champs du formulaire.");
    }
    if (imageInput.size > 4 * 1024 * 1024) {
        alert("La taille de l'image n'est pas conforme.")
    }
    
// FormData est un object permettant de construire un ensemble de paires clé-valeurs d'un formulaire

    const formData = new FormData();
    formData.append("image", imageInput);
    formData.append("title", titleInput);
    formData.append("category", categorieInput);

// Recupération de l'api POST

    fetch(addWorkUrl, {
        method: 'POST',
        body: formData,
        headers: {
            "Accept": 'application/json',
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(newWork => {
            //Ajoutez le nouveau travail a la galerie
            const galleryContainer = document.querySelector(".gallery");
            const newWorkGallery = createDocumentWorks(newWork);
            galleryContainer.appendChild(newWorkGallery);
    
            // Ajoutez le nouveau travail au modal
            const newWorkModal = createDocumentWorksInModal(newWork);
            modalContent.appendChild(newWorkModal);
            
            // Permet de reiniatialisé tout les champs du formulaire.
            
            const form = document.querySelector(".form-add");
            form.reset();
            iconeImage.style.display = "block";
            labelInput.style.display = "flex";
            preview.classList.remove("preview");
            preview.src = "";

            alert("Le travail à été ajouté avec succés");
        })
        .catch(error => {
            console.error('Erreur lors de la communication avec l\'API :', error);
 });
 
}
submitBtn.addEventListener("click", addWork);

// Création des variables pour la prévisualisation 

const iconeImage = document.querySelector(".fa-image");
const labelInput = document.getElementById("label-input");
const previewImageInput = document.getElementById("imageInput"); 
const preview = document.getElementById("preview"); 

//Changement selon si une image à été charger 

previewImageInput.addEventListener("change", (e) => {
    const img = document.querySelector("input[type=file]").files[0];
    if (img) {
        iconeImage.style.display = "none";
        labelInput.style.display = "none";
        preview.classList.add("preview");
        previewImage(img);
    }
})

// Fonction de prévisualisation de l'image

function previewImage(img) {
    const reader = new FileReader();

    reader.addEventListener("load", function () {
        preview.src = reader.result;
    });
    reader.readAsDataURL(img);
}
