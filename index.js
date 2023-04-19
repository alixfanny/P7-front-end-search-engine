async function getRecipes() {
    let response = await fetch('./recipes.json');
    let recipes = response.json();

    return recipes

}

function displayData(recipes) {
    const recipesSection = document.querySelector(".container-recette");
    const dropdownMenuIngredients = document.getElementById("dropdown_menu_ingredients");
    const dropdownMenuAppliance = document.getElementById("dropdown_menu_appliance");
    const dropdownMenuUstensils = document.getElementById("dropdown_menu_ustensils");

    recipes.forEach((recipe) => {
        const domRecipe = recipeFactory(recipe);
        const userCardDOM = domRecipe.getUserCardDOM();
        recipesSection.appendChild(userCardDOM);

        const domDropdownIngredients = dropdownFactory(recipe);
        const dropdownCardDomIngredients = domDropdownIngredients.getDropdownIngredients();
        dropdownMenuIngredients.appendChild(dropdownCardDomIngredients);

        const domDropdownAppliance = dropdownFactory(recipe);
        const dropdownCardDomAppliance = domDropdownAppliance.getDropdownAppliance();
        dropdownMenuAppliance.appendChild(dropdownCardDomAppliance);

        const domDropdownUstensils = dropdownFactory(recipe);
        const dropdownCardDomnUstensils = domDropdownUstensils.getDropdownUstensils();
        dropdownMenuUstensils.appendChild(dropdownCardDomnUstensils);
    });
    
};

async function init() {

    const recipes  = await getRecipes();
    displayData(recipes);
};

init();

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

function dropdownFactory(data){
    const {ingredients, appliance, ustensils} = data;

    function getDropdownIngredients() {
        const divIngredients = document.createElement( 'div' );
        ingredients.forEach(function(ingredient){
            const liIngredient = document.createElement('li');
            liIngredient.textContent = ingredient.ingredient; 
            divIngredients.appendChild(liIngredient);
        })
        divIngredients.classList.add('ingredients-menu');
       return divIngredients;
    }

    function getDropdownAppliance() {
        const liAppliance = document.createElement( 'li' );
        liAppliance.textContent = appliance;
        liAppliance.classList.add('appliance-menu');
       return liAppliance;
    }

    function getDropdownUstensils() {
        const divUstensils = document.createElement( 'div' );
        ustensils.forEach(function(ustensil){
            const liUstensil = document.createElement('li');
            liUstensil.textContent = ustensil; 
            divUstensils.appendChild(liUstensil);
        })
        divUstensils.classList.add('ustensils-menu');
       return divUstensils
    }
    return{getDropdownIngredients, getDropdownAppliance, getDropdownUstensils}
}


