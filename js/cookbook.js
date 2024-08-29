const newForm = document.querySelector('#create-recipe');
const nameInput = document.querySelector('#r-name');
const servingsInput = document.querySelector('#servings');
const ingredientInput = document.querySelector('#addIng');
const ingredientQuantInput = document.querySelector('#addQuant');
const instructionsInput = document.querySelector('#instructions');
const addBut = document.querySelector('#add');
const submitBut = document.querySelector('#create');
const unitsInput = document.querySelector('#units');
let ingArr = [];
const idArr = [];
let numberOfRec = 0;
let numberOfIng = 0;
const recipeMap = new Map([['matcha-pancakes', [['matcha powder', 0.7, 'g'], ['flour', 30, 'g'], ['baking powder', 2.4, 'g'], ['cottage cheese', 113, 'g'], ['milk', 15, 'g'], ['egg', 50, 'g']]]]);

function deleteLinks(href)
{
    const links = document.querySelectorAll('a');
    links.forEach(link =>
        {
            if (link.getAttribute('href') == href)
            {
                const listItem = link.closest('li');
                if (listItem) 
                {
                    listItem.parentNode.removeChild(listItem);
                } 
                else 
                {
                    link.parentNode.removeChild(link);
                }
            }
        });
}

function getFirstWord(inputString) 
{
    let trimmedString = inputString.trim();
    let words = trimmedString.split(" ");
    return words[0];
}

function updateCart()
{
    //check if items contains any needs
    // add needs - items to cart
    let needs = JSON.parse(localStorage.getItem('needs')) || [];
    let items = JSON.parse(localStorage.getItem('items')) || [];
    let newCart = [];
    if (items.length!= 0)
    {
    items.forEach(arr => 
        {
            const [name, quant, unit] = arr;
            needs.forEach(item =>
                {
                    let [cartName, cartQuant, cartUnit] = item;
                    if (cartName == name)
                    {
                        if (unit != cartUnit)
                        {
                            console.error("wrong units");
                        }
                        cartQuant -= quant;
                        if (cartQuant <= 0)
                        {
                            //don't add
                        }
                        else
                        {
                            newCart.push([cartName, cartQuant, cartUnit])
                        }
                    }
                    else
                    {
                        newCart.push([cartName, cartQuant, cartUnit])
                    }
                })
        })
    }
    else
    {
        needs.forEach(item =>
            {
                newCart.push(item);
            })
    }
    console.log("updating cart");
    localStorage.setItem('cart', JSON.stringify(newCart));
}

function convertToGrams(unit, quant) 
{
    switch(unit) 
    {
        case 'oz':
            return quant * 28.35;
        case 'lbs':
            return quant * 453.6;
        case 'g':
            return quant;
        default:
            console.error('Unknown unit:', unit);
            return null; 
    }
}

function addLink(name, href)
{
    const ul = document.querySelector('#links-ul');
    const newItem = document.createElement('li');
    const newLink = document.createElement('a');
    newLink.href = `#${href}`;
    newLink.textContent = name;
    newItem.appendChild(newLink);
    const secondToLastItem = ul.children[ul.children.length - 2];
    ul.insertBefore(newItem, secondToLastItem.nextSibling);

}

addBut.addEventListener("click", addIng);
function addIng()
{
    ingArr.push([ingredientInput.value, ingredientQuantInput.value, unitsInput.value]);
    console.log(ingArr);
    document.getElementById('new-ings').insertAdjacentHTML("beforeend", '<li class ="idChild"> ' + ingredientQuantInput.value + " "+ unitsInput.value + " " + ingredientInput.value + ' </li>');
    ingredientInput.value = "";
    ingredientQuantInput.value = "";
    numberOfIng++;
}

function deleteRecipe(button)
{
    let element = button.previousElementSibling;
    console.log("First previous sibling: ", element);
    
    element = element.querySelector('input[type="checkbox"]');
    console.log("input of that: ", element);
    
    if (element && element.tagName === 'INPUT') {
        console.log("The input element: ", element);
        console.log("ID to delete: ", element.id);
    } else {
        console.error("Input element not found or incorrect DOM structure.");
    }
    // debugging
    const recipeToDelete = button.closest('section');
    recipeToDelete.remove();
    const firstCheckBox = recipeToDelete.querySelector('input[type="checkbox"]');
    console.log(firstCheckBox);
    if (firstCheckBox && firstCheckBox.id) 
    {
        // Log the href value
        console.log("href= " + `#${firstCheckBox.id}`);
        deleteLinks(`#${(firstCheckBox.id)}`);
        if (firstCheckBox.checked)
        {
            console.log("deleting stored ingredients");
            localStorage.removeItem(`checkbox-${firstCheckBox.id}`);
            //removing checkbox true false thing
            storeEachIngredient(firstCheckBox.id, false);
            //remove ing added to cart
        }
    }
     else 
    {
        console.log("No checkbox or checkbox ID found in the section.");
    }

    deleteRecipeFromLocalStorage(firstCheckBox.id);
    console.log( "successfully removed from map: "+ recipeMap.delete(element.id));

    //remove checkbox from storadge
    // save the recipe being removed to be removed from html
    // storeEachIngredient(key, shouldStore)--> if false, removes array of ingredients for key from recipeMap
    //addToCartFunction(unchecked) -->removes items from shopping car/ storage
    //saveRecipeToLocalStorage(recipe) --> adds new recpie to list of stored recepies (recipe is an obj with var id and arr ings)
    //loadRecipesFromLocalStorage() --> populates recipie map, "renders the recipe" (adds its html)
    //onload --> loadRecipesFromLocalStorage();
// --> checks each checkbox and if its stored state is true, checks and restores if true, unchecks if false
}

function storeEachIngredient(key, shouldStore) 
{
    const arrOfIngs = recipeMap.get(key);
    const needs = JSON.parse(localStorage.getItem('needs')) || [];
    
    if (!arrOfIngs) 
    {
        console.error(`No ingredients found for the given key: ${key}`);
        return;
    }

    arrOfIngs.forEach(arr => 
    {
        let added = false;
        const [ingKey, quant, unit] = arr;
        if (shouldStore) 
        {
            const quantAsNumber = parseFloat(quant);
            let newQuant = convertToGrams(unit, quantAsNumber);
            for (let i = 0; i < needs.length; i++)
            {
                if (needs[i][0] == ingKey)
                {
                    needs[i][1] += newQuant;
                    added = true;
                    //figure out how to subtract if remove from cart
                    break;
                }
            }
            if (!added)
            {
                needs.push([ingKey, newQuant, "g"]);
            }
            localStorage.setItem('needs', JSON.stringify(needs));
        } 
        else 
        {
            deleteIngsFromNeeds(ingKey);
        }
    });
    updateCart();
}

function deleteIngsFromNeeds(ingKey)
{
    const needs = JSON.parse(localStorage.getItem('needs')) || [];
    let len = needs.length;
    let newNeeds = [];
    for (let i = 0; i < len; i++)
            {
                if (needs[i][0] == ingKey)
                {
                    //don't add
                }
                else
                {
                    newNeeds.push(needs[i]);
                }
            }
            localStorage.setItem('needs', JSON.stringify(newNeeds));
}

function addToCartFunction(checkbox)
{
     const isChecked = checkbox.checked;
     const recipeKey = checkbox.id;
     
     localStorage.setItem(`checkbox-${recipeKey}`, isChecked);

      if (isChecked) 
      {
        console.log(`Added ${recipeMap.get(recipeKey)} to shopping cart`);
        storeEachIngredient(recipeKey, true);
     } 
     else 
     {
        console.log(`Removed ${recipeMap.get(recipeKey)} from shopping cart`);
        storeEachIngredient(recipeKey, false);
        }
}


submitBut.addEventListener('click', onSubmit);

function generateIngList(arr)
{
    let html = "";
    for (let array of arr)
    {
        console.log(`adding : <li> ${array[1]} ${array[2]} ${array[0]} </li>`);
        html += `<li> ${array[1]} ${array[2]} ${array[0]} </li>`;
    }
    return html;
}

function deleteRecipeFromLocalStorage(theId)
{
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    let len = recipes.length;
    let newRecipes = [];
    for (let i = 0; i < len; i++)
    {
        if (recipes[i].id == theId)
        {
            console.log(`did not add ${theId}`);
        }
        else
        {
            newRecipes.push(recipes[i]);
        }
    }
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
}

//Store recipes in localStorage
function saveRecipeToLocalStorage(recipe) 
{
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Retrieve and render recipes from localStorage on page load
function loadRecipesFromLocalStorage() 
{
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.forEach(recipe => {
        // Populate the recipeMap
        recipeMap.set(recipe.id, recipe.ingredients);
        // Render the recipe
        renderRecipe(recipe);
    });
}

function renderRecipe(recipe) {
    const { id, name, servings, ingredients, instructions } = recipe;
    document.getElementById('next-rec').insertAdjacentHTML("beforeend", `
    <div class="container">
        <section class="recipe">
            <h1>${name}</h1>
            <h2>Ingredients (serves ${servings})</h2>
            <ul class="ingredients">
                ${generateIngList(ingredients)}
            </ul>
            <h2>Instructions</h2>
            <p>${instructions}</p>
            <br>
            <label class="cont" for="${id}">
                <input type="checkbox" id ='${id}' name="addToShoppingCart" value="addToShoppingCart" onclick="addToCartFunction(this)">
                <span class="checkmark"></span>Add to shopping cart</label>
            <button class="delete" onclick="deleteRecipe(this)">Delete Recipe</button>
        </section>
    </div>
    `);
}

function onSubmit(e)
{
    e.preventDefault();
    let iD = getFirstWord(nameInput.value);
    recipeMap.set(getFirstWord(nameInput.value), ingArr.slice());
    for (let entries of recipeMap.entries())
    {
        console.log("entry: "+ entries);
    }
    const recipe = {
        id: iD,
        name: document.querySelector('#r-name').value,
        servings: servingsInput.value,
        ingredients: ingArr.slice(),
        instructions: document.querySelector('#instructions').value
    };

     // Save the recipe to localStorage
     saveRecipeToLocalStorage(recipe);

     // Render the recipe
     renderRecipe(recipe);

    addLink(nameInput.value, iD);

    //reset form
    document.querySelector('#r-name').value = "";
    servingsInput.value = "";
    ingArr = [];
    numberOfIng = 0;
    document.querySelector('#instructions').value = "";
    
    //remove ingredients from the form
    let lists = document.getElementsByClassName("idChild");
    while (lists.length > 0) {
        lists[0].remove();
    }
}

window.onload = function() 
{
    loadRecipesFromLocalStorage();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(checkbox => 
    {
        const recipeKey = checkbox.id;
        const storedState = localStorage.getItem(`checkbox-${recipeKey}`);

        if (storedState === 'true') 
        {
            checkbox.checked = true;
           // storeEachIngredient(recipeKey, true);  // restore the ingredients
        } 
        else 
        {
            checkbox.checked = false;
        }
    });
};

