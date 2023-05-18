let recipes = [];
let allIngredients = [];
let allAppliances = [];
let allUstensils = [];
let filters = {
    appliance: "",
    ingredients: [],
    ustensils: [],
}
const tagsPlace = document.querySelector(".tags");

// Exécute les fonctions pour initialiser l'application
async function init() {
    const recipes = await getRecipes(); 
    displayRecipes(recipes); 
    displayDropdownMenus();             
    applyFiltersRecipes();                    
    setupDropdownEvents();
    setupArrowRotation();
    setupDropdownFocus();
    filterKeywordInput();
}

// Récupère les recettes depuis le fichier JSON
async function getRecipes() {
    let response = await fetch('./recipes.json');
    recipes = await response.json();

    return recipes
}

// Affiche les recettes sur la page
function displayRecipes(recipes) {                                            
    const recipesSection = document.querySelector(".container-recette");
    recipesSection.innerHTML = " ";

    if(recipes.length === 0) {
        displayErrorMessage(recipesSection, true);
    } else {
        displayErrorMessage(recipesSection, false);
        recipes.forEach((recipe) => {
            const domRecipe = createRecipeElement(recipe);
            const userCardDOM = domRecipe.getUserCardDOM();                     
            recipesSection.appendChild(userCardDOM);
        });
    }
    populateDropdownArrays(recipes)
}

// Crée un élément DOM pour une recette
function createRecipeElement(data) {
    const {id, name, description, ingredients, time, portrait} = data;
    const picture = `media/${portrait}`;

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
        ingredients.forEach(function(ingredient){
            const ingredientEl = document.createElement('div');
            const ingredientRecipe = ingredient.ingredient;

            if(ingredient.unit && ingredient.quantity){
                ingredientEl.innerHTML = '<strong>' + ingredientRecipe + '</strong>' + ": " + ingredient.quantity +" " + ingredient.unit;
            }
            else if(ingredient.quantity){
                ingredientEl.innerHTML = '<strong>' + ingredientRecipe + '</strong>' + ": " + ingredient.quantity;
            }

            else {
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

// Remplit les tableaux pour les menus déroulants
function populateDropdownArrays(recipes) {
    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
           if(!allIngredients.includes(ingredient.ingredient)){
            allIngredients.push(ingredient.ingredient)
           }
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

// Affiche les menus déroulants sans filtres
function displayDropdownMenus(filteredIngredients = allIngredients, filteredAppliances = allAppliances, filteredUstensils = allUstensils){
    const ulIngredient = document.getElementById("dropdown_menu_ingredients");
    const ulAppliance = document.getElementById("dropdown_menu_appliance");
    const ulUstensil = document.getElementById("dropdown_menu_ustensils");
    let numberMax =  0;

    ulIngredient.innerHTML = ""; 
    filteredIngredients.forEach((ingredient) => {
        if(numberMax < 30){
            numberMax ++;
            const liIngredient = document.createElement('li');
            liIngredient.textContent = ingredient;
            liIngredient.setAttribute("data-value", ingredient);
            liIngredient.setAttribute("data-type", "ingredient");
            liIngredient.classList.add("item")
            ulIngredient.appendChild(liIngredient);
        }
    });

    ulAppliance.innerHTML = "";
    filteredAppliances.forEach((appliance) => {
        const liAppliance = document.createElement('li');
        liAppliance.textContent = appliance;
        liAppliance.setAttribute("data-value", appliance);
        liAppliance.setAttribute("data-type", "appareil");
        liAppliance.classList.add("item")
        ulAppliance.appendChild(liAppliance);
    });

    ulUstensil.innerHTML = "";
    filteredUstensils.forEach((ustensil) => {
        const liUstensil = document.createElement('li');
        liUstensil.textContent = ustensil;
        liUstensil.setAttribute("data-value", ustensil);
        liUstensil.setAttribute("data-type", "ustensil");
        liUstensil.classList.add("item")
        ulUstensil.appendChild(liUstensil);
    });
    closeDropdown();
}

// Filtre les recettes en fonction de l'objet filters
function applyFiltersRecipes() {
    const filteredRecipes = recipes.filter(recipe => {
        if(filters.appliance !== "" && recipe.appliance !== filters.appliance) {
            return false;
        }

        if(filters.ingredients.length) {
            const allIngredientsExist = filters.ingredients.every(filterIngredient => {
                return recipe.ingredients.some(ingredient => {
                    const ingredientName = ingredient.ingredient;
                    return ingredientName === filterIngredient;
                })
            })

            if(!allIngredientsExist) {
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
        return true
    })
   return filteredRecipes;
} 

function applyFilterDropdown(recipes) {
    let ingredients = [];
    let appliances = [];
    let ustensils = [];
    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
           if(!ingredients.includes(ingredient.ingredient)){
            ingredients.push(ingredient.ingredient)
           }
        })
    });
    
    recipes.forEach((recipe) => {
        if(!appliances.includes(recipe.appliance)){
            appliances.push(recipe.appliance);
        }
    });
    
    recipes.forEach((recipe) => {
        recipe.ustensils.forEach((ustensil) => {
           if(!ustensils.includes(ustensil)){
            ustensils.push(ustensil)
           }
        })
    });
    return {ingredients, appliances, ustensils}
}

// Récupère la valeur de l'élément sélectionné et met à jour l'objet filters
function updateFilters(event) {

    const keyWordType = event.target.dataset.type;
    const value = event.target.dataset.value;

    if(keyWordType === "appareil") {
        filters.appliance = value;
    }

    if(keyWordType === "ingredient") {
        filters.ingredients.push(value);
    }

    if(keyWordType === "ustensil") {
        filters.ustensils.push(value);
    }
} 

// Affiche le tag sélectionné à partir des menus déroulants
function displaySelectedTag(event) {
  
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

    const inputElement = event.target.closest(".dropdown").querySelector("input");
    const desactivated = event.target.closest(".dropdown").querySelector(".desactivated");
    if (inputElement && desactivated) {
        inputElement.style.display = "none";
        desactivated.classList.add("show-label");
    }

    removeTag()
}

// Configure les événements pour les menus déroulants
function setupDropdownEvents() {
    let keyWords = document.querySelectorAll(".item"); 

    keyWords.forEach((keyWord) => {                             
        keyWord.addEventListener("click", function(event) {

            if(!tagExists(event.target.dataset.value)) {
                displaySelectedTag(event);
            }

            const inputElement = event.target.closest(".dropdown").querySelector("input");
            if (inputElement) {
                inputElement.value = "";
            }

            updateFilters(event);
            const recipesToDisplay = applyFiltersRecipes(recipes);
            displayRecipes(recipesToDisplay);
            const {ingredients, appliances, ustensils} = applyFilterDropdown(recipesToDisplay);
            displayDropdownMenus(ingredients, appliances, ustensils);

        })
    })
}

function tagExists(value) {
    const existingTags = document.querySelectorAll(".tag");
    let tagExists = false;

    existingTags.forEach((tag) => {
        if (tag.getAttribute("data-delete") === value) {
            tagExists = true;
        }
    });

    return tagExists;
}

// Supprime un tag et met à jour les filtres
function removeTag() {
    let closeItems = document.querySelectorAll(".close");
  
    closeItems.forEach((item) => {
        item.addEventListener("click", function(event) {
            const value = event.target.dataset.value;           
            const keyWordType = event.target.dataset.type;

            const deleteTag = document.querySelector(`[data-delete="${value}"]`);
            if (deleteTag) {
                deleteTag.remove();
            }
    
            if (keyWordType === "appareil") {
                filters.appliance = "";
                //console.log(filters.appliance) = vide
            }

            if(keyWordType === "ingredient"){
                filters.ingredients = filters.ingredients.filter(ingredient => {
                    return ingredient !== value;
                })
            }

            if(keyWordType === "ustensil"){
                filters.ustensils = filters.ustensils.filter(ustensil => {
                    return ustensil !== value;
                })
            }
            const recipesToDisplay = applyFiltersRecipes(recipes);
            displayRecipes(recipesToDisplay);
            const {ingredients, appliances, ustensils} = applyFilterDropdown(recipesToDisplay);
            displayDropdownMenus(ingredients, appliances, ustensils);
        });
    });
}

// Configure la rotation de la flèche pour les menus déroulants
function setupArrowRotation() {
    const toggles = document.querySelectorAll(".my-toggle");
    const arrowIngredient = document.querySelector(".arrow-ingredient")
    const arrowAppliance = document.querySelector(".arrow-appliance")
    const arrowUstensil = document.querySelector(".arrow-ustensil")
    const items = document.querySelectorAll(".item")
    toggles.forEach((toggle) => {
        toggle.addEventListener("click", function (event) {
            if(event.target === arrowIngredient) {
                arrowIngredient.classList.add("rotated");
            }
            if(event.target === arrowAppliance) {
                arrowAppliance.classList.add("rotated");
            }
            if(event.target === arrowUstensil) {
                arrowUstensil.classList.add("rotated");
            }
        })
    })

    items.forEach((item) => {
        item.addEventListener("click", function (event) {
            if(event.target === arrowIngredient) {
                arrowIngredient.remove("rotated");
            }
            if(event.target === arrowAppliance) {
                arrowAppliance.remove("rotated");
            }
            if(event.target === arrowUstensil) {
                arrowUstensil.remove("rotated");
            }
        })
    })
}

//Gère le focus des éléments input à l'intérieur des dropdowns Bootstrap.
function setupDropdownFocus() {
    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach((dropdown) => {
        dropdown.addEventListener("show.bs.dropdown", function (event) {
            setTimeout(() => {
                const input = dropdown.querySelector("input");
                if (input) {
                    input.focus();
                }
            }, 0);
        });                                                                         

        const dropdownMenu = dropdown.querySelector(".dropdown-menu");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", function (event) {
                event.stopPropagation();
            });
        }
    });
}
document.addEventListener("DOMContentLoaded", function () {
    setupDropdownFocus();
});

//Gère la fermeture du menu de la dropdown
function closeDropdown() {
    const items = document.querySelectorAll(".item");
    items.forEach((item) => {
        item.addEventListener("click", function(){
            const menus = document.querySelectorAll(".dropdown-menu");
            menus.forEach((menu) => {
                menu.classList.remove("show");
            })            
        })
    })
}

//Filtre les dropdown avec la valeur de l'input
function filterKeywordInput() {
    const inputElements = document.querySelectorAll(".dropdown-search-field");

    inputElements.forEach((inputElement) => {
    
        inputElement.addEventListener("input", function(event) {
            //event.stopPropagation();
            //event.preventDefault();
            const champ = event.target.getAttribute('champ');
            const value = event.target.value;
            const dropdownMenu = event.target.closest(".dropdown").querySelector(".dropdown-menu");
            const recipesToDisplay = applyFiltersRecipes(recipes);
            const {ingredients, appliances, ustensils} = applyFilterDropdown(recipesToDisplay);
            
            if(champ === "ingredient") {
                const filteredIngredients = ingredients.filter(ingredient =>
                    ingredient.toLowerCase().includes(value.toLowerCase())
                );
                displayDropdownMenus(filteredIngredients, appliances, ustensils);
                displayErrorMessage(dropdownMenu, filteredIngredients.length === 0);
            }

            if(champ === "appareil") {
                const filteredAppliances = appliances.filter(appliance =>
                    appliance.toLowerCase().includes(value.toLowerCase())
                );
                displayDropdownMenus(ingredients, filteredAppliances, ustensils);
                displayErrorMessage(dropdownMenu, filteredAppliances.length === 0);
            }

            if(champ === "ustensil") {
                const filteredUstensils = ustensils.filter(ustensil =>
                    ustensil.toLowerCase().includes(value.toLowerCase())
                );
                displayDropdownMenus(ingredients, appliances, filteredUstensils);
                displayErrorMessage(dropdownMenu, filteredUstensils.length === 0);
            }
            setupDropdownEvents();
        })
    })
}

function displayErrorMessage(dropdownMenu, shouldDisplay) {
    let errorMessage = dropdownMenu.querySelector(".error-message");
    if (!errorMessage) {
        errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = "Aucun élément trouvé";
        dropdownMenu.appendChild(errorMessage);
    }

    if (shouldDisplay) {
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
    }
}

let searchBar = document.querySelector(".form-control");
let recipesSection = document.querySelector(".container-recette");

searchBar.addEventListener("input", function(event) {
    let keyword = event.target.value.toLowerCase();

    if (keyword.length >= 3) {
        let filteredRecipes = [];
        for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            let isMatched = false;

            if (recipe.name.toLowerCase().includes(keyword)) {
                isMatched = true;
            } else {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    let ingredient = recipe.ingredients[j].ingredient.toLowerCase();
                    if (ingredient.includes(keyword)) {
                        isMatched = true;
                        break;
                    }
                }
            }

            if (recipe.description.toLowerCase().includes(keyword)) {
                isMatched = true;
            }

            if (isMatched) {
                filteredRecipes.push(recipe);
            }
        }

        if (filteredRecipes.length > 0) {
            displayRecipes(filteredRecipes);
            displayErrorMessage(recipesSection, false);
        } else {
            recipesSection.innerHTML = "";
            displayErrorMessage(recipesSection, true);
        }
    }else if (keyword.length === 0){
        displayRecipes(recipes)
        displayErrorMessage(recipesSection, false);
    }else {
        displayErrorMessage(recipesSection, false);  
    }
});

init(); 