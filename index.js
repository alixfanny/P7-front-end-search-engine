let recipes = [];
let allIngredients = [];
let allAppliances = [];
let allUstensils = [];
let filters = {
    appliance: "",
    ingredients: [],
    ustensils: [],
}

async function init() {
    const recipes = await getRecipes();
    displayData(recipes);
    afficheMenuDropdown();
    valueKeyWord();
    filterRecipes();
}

init();

async function getRecipes() {
    let response = await fetch('./recipes.json');
    recipes = await response.json();

    return recipes
}

function displayData(recipes) {
    const recipesSection = document.querySelector(".container-recette");
    recipesSection.innerHTML = " ";

    recipes.forEach((recipe) => {
        const domRecipe = recipeFactory(recipe);
        const userCardDOM = domRecipe.getUserCardDOM();
        recipesSection.appendChild(userCardDOM);
    });

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

function recipeFactory(data) {
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

function afficheMenuDropdown(){
    const ulIngredient = document.getElementById("dropdown_menu_ingredients");
    const ulAppliance = document.getElementById("dropdown_menu_appliance");
    const ulUstensil = document.getElementById("dropdown_menu_ustensils");
    let numberMax =  0;

    allIngredients.forEach((ingredient) => {
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
    const filteredRecipes = recipes.filter(recipe => {
        if(filters.appliance !== "" && recipe.appliance !== filters.appliance) {
            return false;
        }

        if(filters.ingredients.length) {
            const ingredientExists = recipe.ingredients.find(ingredient => {
                const ingredientName = ingredient.ingredient;
                return filters.ingredients.includes(ingredientName);
            })
            console.log(ingredientExists)
            if(ingredientExists === undefined) {
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

function valueKeyWord() {
    let keyWords = document.querySelectorAll(".item");

    keyWords.forEach((keyWord) => {
    keyWord.addEventListener("click", function(event) {
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

        const recipesToDisplay = filterRecipes(recipes);
        displayData(recipesToDisplay);
        })
    })
}

