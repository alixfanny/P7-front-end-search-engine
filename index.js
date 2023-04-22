let recipes = [];
let allIngredients = [];
let allAppliances = [];
let allUstensils = [];

async function init() {
    const recipes = await getRecipes();
    displayData(recipes);
    afficheMenuDropdown();
    choiceKeyWordsAppliance();
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
            liIngredient.setAttribute("value", ingredient);
            liIngredient.classList.add("item-ingredient")
            ulIngredient.appendChild(liIngredient);
        }
    });

    allAppliances.forEach((appliance) => {
        const liAppliance = document.createElement('li');
        liAppliance.textContent = appliance;
        liAppliance.setAttribute("data-value", appliance);
        liAppliance.classList.add("item-appliance")
        ulAppliance.appendChild(liAppliance);
    });

    allUstensils.forEach((ustensil) => {
        const liUstensil = document.createElement('li');
        liUstensil.textContent = ustensil;
        liUstensil.setAttribute("value", ustensil);
        liUstensil.classList.add("item-ustensil")
        ulUstensil.appendChild(liUstensil);
    });
}

function choiceKeyWordsAppliance() {
    let keyWords = document.querySelectorAll(".item-appliance");

    keyWords.forEach((element) => {
        element.addEventListener("click", function(event){
            let keyWord = event.target.dataset.value;
            const filterRecipes = recipes.filter(recipe => {
                return recipe.appliance === keyWord;
            })
            displayData(filterRecipes)
        })
    })
} 

