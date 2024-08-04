const newForm = document.querySelector('#create-recipe');
const nameInput = document.querySelector('#r-name');
const servingsInput = document.querySelector('#servings');
const ingredientInput = document.querySelector('#addIng');
const instructionsInput = document.querySelector('#instructions');
const addBut = document.querySelector('#add');
const submitBut = document.querySelector('#create');
let ingArr = [];
const idArr = [];
let numberOfRec = 0;
const recipeMap = new Map([['matcha-pancakes', ['2 teaspoons matcha powder',
'1/4 cup flour',
'1/2 teaspoon baking powder',
'1/2 cup cottage cheese',
'1 tablespoon milk', '1 large egg']]]);

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

function getFirstWord(inputString) {
    // Trim the string to remove any leading or trailing whitespace
    var trimmedString = inputString.trim();
    
    // Split the string by spaces
    var words = trimmedString.split(" ");
    
    // Return the first word
    return words[0];
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
    ingArr.push(ingredientInput.value);
    console.log(ingArr);
    document.getElementById('new-ings').insertAdjacentHTML("beforeend", '<li class ="idChild"> ' + ingredientInput.value + ' </li>');
    ingredientInput.value = "";
}

function deleteRecipe(button)
{
    const recipeToDelete = button.closest('section');
    recipeToDelete.remove();
    const firstCheckBox = recipeToDelete.querySelector('input[type="checkbox"]');
    console.log(firstCheckBox);
    if (firstCheckBox && firstCheckBox.id) 
    {
        // Log the href value
        console.log("href= " + `#${firstCheckBox.id}`);
        deleteLinks(`#${(firstCheckBox.id)}`);
    }
     else 
    {
        console.log("No checkbox or checkbox ID found in the section.");
    }
}

function addToCartFunction(button)
{
    console.log ('#' + button.id);
     const addCheck = document.querySelector('#' + button.id);      
    if (addCheck.checked == true)
    {
        console.log(`added ${recipeMap.get(button.id)} to shopping cart`);
    }
}


submitBut.addEventListener('click', onSubmit);

function onSubmit(e)
{
    e.preventDefault();
    idArr[numberOfRec] = getFirstWord(nameInput.value);
    recipeMap.set(idArr[numberOfRec], ingArr.slice());
    for (let entries of recipeMap.entries())
    {
        console.log("entry: "+ entries);
    }
    console.log(idArr[numberOfRec]);
    let ingList = "";
    for (let ing of ingArr)
    {
        ingList += `<li>${ing}</li>`;
    }
    document.getElementById('next-rec').insertAdjacentHTML("beforeend", `
    <div class="container">
        <section class="recipe">
            <h1>${document.querySelector('#r-name').value}</h1>
            <h2>Ingredients (serves ${servingsInput.value})</h2>
            <ul class="ingredients">
                ${ingList}
            </ul>
            <h2>Instructions</h2>
            <p>${document.querySelector('#instructions').value}</p>
            <br>
            <label class="cont" for="${idArr[numberOfRec]}">
                <input type="checkbox" id ='${idArr[numberOfRec]}' name="addToShoppingCart" value="addToShoppingCart" onclick="addToCartFunction(this)">
                <span class="checkmark"></span>Add to shopping cart</label>
            <button class="delete" onclick="deleteRecipe(this)">Delete Recipe</button>
        </section>
    </div>
    <div class="container">
        <div id="next-rec"></div>
    </div>
    `);
    addLink(nameInput.value, idArr[numberOfRec]);
    document.querySelector('#r-name').value = "";
    servingsInput.value = "";
    ingArr = [];
    document.querySelector('#instructions').value = "";
    let lists = document.getElementsByClassName("idChild");
    if (lists.length != 0)
    {
            for (let ing of lists)
        {
            console.log("removing " + ing);
            ing.remove();
        }
    }
    if (lists.length != 0)
    {
        lists[0].remove();
    }
    numberOfRec++;
}

