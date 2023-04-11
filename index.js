async function getRecipes() {
    let response = await fetch('./recipes.json');
    let recipes = response.json();

    return recipes

}

function displayData(recipes) {
    console.log(recipes)
    const recipesSection = document.querySelector(".container-recette");

    recipes.forEach((recipe) => {
        const domRecipe = recipeFactory(recipe);
        const userCardDOM = domRecipe.getUserCardDOM();
        recipesSection.appendChild(userCardDOM);
    });
};

async function init() {

    const recipes  = await getRecipes();
    displayData(recipes);
};

init();

function recipeFactory(data) {
    const {id, name, description, ingredients, time, } = data;

    function getUserCardDOM() {
        const article = document.createElement( 'article' );
        article.classList.add('recipe');

        const div = document.createElement('div');
        div.classList.add('content-img', 'card');

        const img = document.createElement( 'img' );
        img.classList.add("img-recipe");

        const divBody = document.createElement('div');
        divBody.classList.add("card-body")

        const divTitle = document.createElement('div');
        divTitle.classList.add('content-title', "card-text");

        const h3 = document.createElement( 'h3' );
        h3.textContent = name;

        const pTime = document.createElement( 'p' );
        pTime.textContent = time + "min";
        pTime.classList.add('time');

        const divDescription = document.createElement('div');
        divDescription.classList.add('content-description', "card-text");


        const pIngredients = document.createElement( 'div' );
        ingredients.forEach(function(ingredient){
            const ingredientEl = document.createElement('div');
            if(ingredient.unit && ingredient.quantity){
                ingredientEl.textContent = ingredient.ingredient + ": " + ingredient.quantity +" " + ingredient.unit;
            }
            else if(ingredient.quantity){
                ingredientEl.textContent = ingredient.ingredient + ": " + ingredient.quantity;
            }

            else {
                ingredientEl.textContent = ingredient.ingredient;
            }
            pIngredients.appendChild(ingredientEl);
        })
        pIngredients.classList.add('ingredients');

        const pDescription = document.createElement( 'p' );
        pDescription.textContent = description;
        pDescription.classList.add('description');

        article.appendChild(div);
        article.appendChild(divTitle);
        article.appendChild(divDescription);
        div.appendChild(img);
        divTitle.appendChild(h3);
        divTitle.appendChild(pTime);
        divDescription.appendChild(pIngredients);
        divDescription.appendChild(pDescription);
        return (article);
    }
    
    return {getUserCardDOM}
}

