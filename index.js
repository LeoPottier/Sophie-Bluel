// Récupération des URL de l'API et des elements du DOM

const categoriesUrl = 'http://localhost:5678/api/categories';
const worksUrl = 'http://localhost:5678/api/works';

const galleryContainer = document.querySelector(".gallery");
const filterContainer = document.querySelector(".filter");

// Creation des elements acceuillant les projets de Sophie 

export function createDocumentWorks(works) {
  // Manipulation du DOM  

      const figure = document.createElement('figure');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const figureTitle = document.createElement('figcaption')
      figure.setAttribute('data-id', works.id); // On créer un attribut qui va nous servir pour la suppression

      img.src = works.imageUrl;
      figureTitle.textContent = works.title;

      figure.appendChild(div);
      div.appendChild(img);
      div.appendChild(figureTitle);

    return figure;
}


// Récupération de l'API pour les elements Works

function getWorks() {   
  fetch(worksUrl)
      .then((response) => {
          return response.json();
      })
      .then((data) => {
          data.forEach((works) => {
              const figure = createDocumentWorks(works);
              galleryContainer.appendChild(figure);
          });
          localStorage.setItem('works', JSON.stringify(data));
      })
      .catch(function (error) {
          console.log(error); //Ajout d'une gestion d'erreur dans la requête fetch
      });
}

getWorks()


// Récupération de l'API pour les categories

function getCategories() {

  fetch(categoriesUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const div = document.createDocumentFragment();
      const catFilter = data;

      // localStorage.setItem('catFilter', JSON.stringify(catFilter));
      catFilter.forEach((categorie) => {
        const button = document.createElement("button");
        button.textContent = categorie.name;
        button.classList.add("filterClass")
        button.addEventListener("click", () => {
          galleryContainer.innerHTML = "";
          findByCategory(categorie.id);
        });
        div.appendChild(button);
      });

      // Ajouter le fragment de document au DOM 
      filterContainer.appendChild(div);
    })
    .catch(function (error) {
      console.log(error); // Ajout d'une gestion d'erreur dans la requête fetch
    });
}

// Appeler getCategories pour initialiser les catégories au chargement de la page

getCategories();

// Fonction qui permet de retrouver les categories de chaque travaux

function findByCategory(id) {
  const works = JSON.parse(localStorage.getItem('works'));
  const filteredWorks = works.filter((work) => work.category.id === id); // Cette ligne filtre les travaux en ne conservant que celles dont l'ID de catégorie correspond à l'ID fourni en argument à la fonction.

  // Créer et ajouter les nouveaux éléments
  const fragment = document.createDocumentFragment();
  filteredWorks.forEach((work) => {
    const figure = createDocumentWorks(work);
    fragment.appendChild(figure);
  });

  // Ajouter le fragment au conteneur
  galleryContainer.appendChild(fragment);
}

// Initialisation du filtre "Tous"

function showAllWorks(works) {
  // Créer un fragment pour stocker le filtre
  const fragment = document.createDocumentFragment();

  // Créer et ajouter le filtre "Tous"
  const noFilter = document.createElement("button");
  noFilter.textContent = "Tous";
  noFilter.classList.add("filterClass");
  noFilter.addEventListener("click", () => {
      galleryContainer.innerHTML = "";
      works.forEach((work) => {
      const figure = createDocumentWorks(work);
      galleryContainer.appendChild(figure);
    });
  });

  fragment.appendChild(noFilter);

  // On ajoute içi la ligne insertBefore pour que le bouton Tous soit le premier filtre
  filterContainer.insertBefore(fragment, filterContainer.firstChild);
}

// Appeler showAllWorks pour le filtre tous avec comme paramètre le local storage stocké précédemment
showAllWorks(JSON.parse(localStorage.getItem('works')));


