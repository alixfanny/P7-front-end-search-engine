let recipes = [];           // cette variable stock un tableau vide mais servira plus tard dans le code pour stocker toutes les recettes donc le Json.
let allIngredients = [];    // cette variable stock un tableau vide mais servira plus tard dans le code pour stocker tous les ingredients de chaqu'une des recettes.
let allAppliances = [];     // cette variable stock un tableau vide mais servira plus tard dans le code pour stocker tous les appareils de chaqu'une des recettes.
let allUstensils = [];      // cette variable stock un tableau vide mais servira plus tard dans le code pour stocker tous les ustensils de chaqu'une des recettes.
let filters = {             // cette variable stock un objet avec trois proprietes 1 chaine de caractéres et 2 tableau vide,
    appliance: "",          // mais servira plus tard dans le code pour stocker les mots cles choissis par l'utilisateur.
    ingredients: [],
    ustensils: [],
}

async function init() {                        // la function init est une fonction async car elle attend de recevoir le return de la function getRecipes().
    const recipes = await getRecipes();        // elle permet de lancer les affichages de la page web et detrmine l'ordre d'execution des fonctions.
    displayData(recipes);
    afficheMenuDropdown();
    valueKeyWord();
    filterRecipes();
    attachTags();
}

init();                                               // j'appelle la fonction init pour lancer la page web.

async function getRecipes() {                       // la function getRecipes() me permet de récupere les données du fichier Json en utilisant la fonction fetch()
    let response = await fetch('./recipes.json');   // et de stocker cette reponse dans la variable recipes.
    recipes = await response.json();

    return recipes
}

function displayData(recipes) {                                            
    const recipesSection = document.querySelector(".container-recette");    // la function displayData() permet d'afficher les recherches dans la page web.
    recipesSection.innerHTML = " ";                                         // je vide la section pour que lors du filtrage uniquement les recette seltectionner s'affiche.

    recipes.forEach((recipe) => {                                           // je fais une boucle avec la fonction forEach() pour qu'elle applique les functions
        const domRecipe = recipeFactory(recipe);                            // recipeFActory et getUserCardDOM() sur chaqu'une des recettes.
        const userCardDOM = domRecipe.getUserCardDOM();                     
        recipesSection.appendChild(userCardDOM);                            // et chaque recette soit un enfant de la section selectionner.
    });

    recipes.forEach((recipe) => {                                   // je fais une boucle sur les recettes pour que sur chaque recette on fasse une boucle sur chaque ingredient
        recipe.ingredients.forEach((ingredient) => {                // pour vérifier que cette ingredient ne soit pas dans le tableau allIngredients avec la function include() 
           if(!allIngredients.includes(ingredient.ingredient)){     // et pouvoir l'ajouter avec la function push()
            allIngredients.push(ingredient.ingredient)              // en francais: dans le tableaux recipes sur chaque recette va dans son tableau ingredients et sur chaque ingredient de ce tableau,
           }                                                        // vérifie que dans allIngredient il n'y soit pas, si il n'y est pas ajoute le sinon ne fais rien et passe au suivant.
        })
        return allIngredients
    });

    recipes.forEach((recipe) => {
        if(!allAppliances.includes(recipe.appliance)){
            allAppliances.push(recipe.appliance)
        }
        return allAppliances
    });

    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
           if(!allUstensils.includes(ustensil)){
            allUstensils.push(ustensil)
           }
        })
        return allUstensils
    })
}

function recipeFactory(data) {
    const {id, name, description, ingredients, time, portrait} = data;          // permet de exploser un objet content plusieurs variable extraite de recipes
    const picture = `media/${portrait}`;                                        // permet de stocker le chemin des photo

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.classList.add('recipe', 'col-4');

        const div = document.createElement('div');
        div.classList.add('content-img', 'card');

        const img = document.createElement( 'img' );
        img.setAttribute("src", picture);
        img.setAttribute("alt", name);
        img.setAttribute("id", id);
        img.classList.add("img-recipe");

        const divBody = document.createElement('div');
        divBody.classList.add("card-body")

        const divTitle = document.createElement('div');
        divTitle.classList.add('content-title', "card-text", "justify-content-between", "d-flex");

        const h3 = document.createElement( 'h3' );
        h3.textContent = name;

        const divIconTime = document.createElement('div');
        divIconTime.classList.add('content-icon', 'd-flex');

        const span = document.createElement('span');
        span.classList.add('fa-solid', 'fa-clock');

        const pTime = document.createElement( 'p' );
        pTime.textContent = time + "min";
        pTime.classList.add('time');

        const divDescription = document.createElement('div');
        divDescription.classList.add('content-description', "card-text", "d-flex");


        const pIngredients = document.createElement( 'div' );                 
        ingredients.forEach(function(ingredient){                       //on fait une boucle sur chaque ingredient du tableau ingredients
            const ingredientEl = document.createElement('div');
            const ingredientRecipe = ingredient.ingredient;

            if(ingredient.unit && ingredient.quantity){         // si dans le tableau il y a des unite et des quantiter alors affiche ca 
                ingredientEl.innerHTML = '<strong>' + ingredientRecipe + '</strong>' + ": " + ingredient.quantity +" " + ingredient.unit;
            }
            else if(ingredient.quantity){                       // si dans le tableau il y a des quantiter alors affiche ca 
                ingredientEl.innerHTML = '<strong>' + ingredientRecipe + '</strong>' + ": " + ingredient.quantity;
            }

            else {                                              // sinon affiche ca 
                ingredientEl.innerHTML = '<strong>' + ingredientRecipe + '</strong>';
            }
            pIngredients.appendChild(ingredientEl);
        })
        pIngredients.classList.add('ingredients');

        const pDescription = document.createElement( 'p' );
        pDescription.textContent = description;
        pDescription.classList.add('description');

        article.appendChild(div);
        article.appendChild(divBody)
        divBody.appendChild(divTitle);
        divBody.appendChild(divDescription);
        div.appendChild(img);
        divTitle.appendChild(h3);
        divTitle.appendChild(divIconTime);
        divIconTime.appendChild(span);
        divIconTime.appendChild(pTime);
        divDescription.appendChild(pIngredients);
        divDescription.appendChild(pDescription);
        return article;
    }
    return {getUserCardDOM}
}

function afficheMenuDropdown(){
    const ulIngredient = document.getElementById("dropdown_menu_ingredients");
    const ulAppliance = document.getElementById("dropdown_menu_appliance");
    const ulUstensil = document.getElementById("dropdown_menu_ustensils");
    let numberMax =  0;

    allIngredients.forEach((ingredient) => {                            // fait une boucle sur chaque element du tableau allIngredients 
        if(numberMax < 30){                                             // et pour chaque element fait numberMax + 1
            numberMax ++;
            const liIngredient = document.createElement('li');          // html cree un li
            liIngredient.textContent = ingredient;                      // arrete toi a 30 ingredient
            liIngredient.setAttribute("data-value", ingredient);
            liIngredient.setAttribute("data-type", "ingredient");
            liIngredient.classList.add("item")
            ulIngredient.appendChild(liIngredient);
        }
    });

    allAppliances.forEach((appliance) => {
        const liAppliance = document.createElement('li');
        liAppliance.textContent = appliance;
        liAppliance.setAttribute("data-value", appliance);
        liAppliance.setAttribute("data-type", "appareil");
        liAppliance.classList.add("item")
        ulAppliance.appendChild(liAppliance);
    });

    allUstensils.forEach((ustensil) => {
        const liUstensil = document.createElement('li');
        liUstensil.textContent = ustensil;
        liUstensil.setAttribute("data-value", ustensil);
        liUstensil.setAttribute("data-type", "ustensil");
        liUstensil.classList.add("item")
        ulUstensil.appendChild(liUstensil);
    });
}

function filterRecipes() {
    const filteredRecipes = recipes.filter(recipe => {                              // sur le tableau recipes filtre dans chaque recette
        if(filters.appliance !== "" && recipe.appliance !== filters.appliance) {    // si l'appareil selectioner n'est pas vide et ne correspond pas a l'appareil d'une des recette
            return false;                                                           // return false 
        }

        if(filters.ingredients.length) {                                            // si le tableau ingredients dans l'objet filters n'est pas vide 
            const ingredientExists = recipe.ingredients.find(ingredient => {        // cherche dans le tableau d'ingredients l'ingredient qui correspond
                const ingredientName = ingredient.ingredient;                       // sur chaqu'un stock le dans ingredientName
                return filters.ingredients.includes(ingredientName);                // verifie que ingredientName est ou n'est pas 
            })

            if(ingredientExists === undefined) {                                    // si le function find resort un defined ne fait rien 
                return false;
            }
        }

        if(filters.ustensils.length) {
            const ustensilExists = recipe.ustensils.find(ustensil => {
                return filters.ustensils.includes(ustensil);
            })

            if(ustensilExists === undefined) {
                return false;
            }
        }
        return true         // si un des if return true alors return true
    })
   return filteredRecipes;
} 

function valueKeyWord() {
    let keyWords = document.querySelectorAll(".item");

    keyWords.forEach((keyWord) => {                             // dans le tableau keyWords boucle sur chaque li et sur le li ou un click a etais fait
    keyWord.addEventListener("click", function(event) {         // fait que si le type est stritement égal a "...." alors sa valeur sera dans la chaine de caretere de l'objet filters
        const keyWordType = event.target.dataset.type;
        const value = event.target.dataset.value;

        if(keyWordType === "appareil") {
            filters.appliance = value;
        }

        if(keyWordType === "ingredient") {                      // fait que si le type est stritement égal a "...." alors la valeur sera ajouter au tableau ingredients de l'objet filters
            filters.ingredients.push(value);
        }

        if(keyWordType === "ustensil") {
            filters.ustensils.push(value);
        }

        const recipesToDisplay = filterRecipes(recipes);        // on appele la function displayData avec comme paramétre(recipesToDisplay) pour afficher les donnes filtrer
        displayData(recipesToDisplay);
        })
    })
} 

const tagsPlace = document.querySelector(".tags");

function attachTags() {
    let keyWords = document.querySelectorAll(".item"); 

    keyWords.forEach((keyWord) => {                             
        keyWord.addEventListener("click", function(event) {    
            const value = event.target.dataset.value;           
            const keyWordType = event.target.dataset.type;
            const p = document.createElement('p');
            const close = document.createElement('i');      

            if(keyWordType === "appareil") {             
                p.setAttribute("style", "background-color: #68D9A4");
                close.setAttribute("data-type", "appareil");
            }

            if(keyWordType === "ingredient") {
                p.setAttribute("style", "background-color: #3282f7");
                close.setAttribute("data-type", "ingredient");
            }

            if(keyWordType === "ustensil") {
                p.setAttribute("style", "background-color: #ED6454");
                close.setAttribute("data-type", "ustensil");
            }

            p.textContent = value;
            p.classList.add("tag");
            p.setAttribute("data-delete", value);
            close.classList.add("close", "fa-regular", "fa-circle-xmark");
            close.setAttribute("data-value", value);
            p.appendChild(close);
            tagsPlace.appendChild(p);

            deleteTags()
        })                                
    })
}

function deleteTags() {
    let closeItems = document.querySelectorAll(".close");
  
    closeItems.forEach((item) => {
        item.addEventListener("click", function(event) {
            const value = event.target.dataset.value;           
            const keyWordType = event.target.dataset.type;
    
            // Supprime le tag de l'affichage
            const deleteTag = document.querySelector(`[data-delete="${value}"]`);
            if (deleteTag) {
                deleteTag.remove();
            }
    
            // Supprime le filtre correspondant
            if (keyWordType === "appareil") {
            filters.appliance = "";
            }

            if(keyWordType === "ingredient"){
                filters.ingredients = filters.ingredients.filter(ingredient => {
                    if(ingredient !== value) {
                        return false
                    }
                })
            }

            if(keyWordType === "ustensil"){
                filters.ustensils = filters.ustensils.filter(ustensil => {
                    if(ustensil !== value) {
                        return false
                    }
                })
            }

            // Met à jour la liste de recettes filtrées
            const recipesToDisplay = filterRecipes(recipes);
            displayData(recipesToDisplay);
        });
    });
}