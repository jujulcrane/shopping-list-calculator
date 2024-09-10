
const itemInput = document.querySelector('#add-item');
const quantInput = document.querySelector('#add-quant');
const addBut = document.querySelector('.add');
const unitsInput = document.querySelector('#units');

function getFirstWord(inputString) {
    // Trim the string to remove any leading or trailing whitespace
    var trimmedString = inputString.trim();
    
    // Split the string by spaces
    var words = trimmedString.split(" ");
    
    // Return the first word
    return words[0];
}

function removeItem(id)
{
    const element = document.getElementById(id);
    let itemToRemove = [];
    if (element) 
    {
        element.remove();
        console.log(`Element with id "${id}" removed.`);
    } 
    else 
    {
        console.error(`Element with id "${id}" not found.`);
    }
    let items = JSON.parse(localStorage.getItem('items')) || [];
    let len = items.length;
    let newItems = [];
    for (let i = 0; i < len; i++)
    {
        console.log(`does ${getFirstWord(items[i][0])} equal ${id}: ${getFirstWord(items[i][0]) == id}`);
        if (getFirstWord(items[i][0]) == id)
        {
            itemToRemove = items[i];
        }
        else
        {
            newItems.push(items[i]);
        }
    }
    localStorage.setItem('items', JSON.stringify(newItems));
    updateCart();
}

function storeItem() 
{
    displayItem(itemInput.value, quantInput.value, unitsInput.value);
    //convert quant to grams
    let convertedQuant = convertToGrams(unitsInput.value, quantInput.value)
    saveItemToLocalStorage([itemInput.value, convertedQuant, "g"]);
    updateCartWithStoredItem(itemInput.value, convertedQuant);
    itemInput.value ="";
    quantInput.value="";
}

function updateCartWithStoredItem(itemName, quantity) 
{
    let needs = JSON.parse(localStorage.getItem('needs')) || [];
    let newCart = [];
    
    // Loop through the current cart (needs) to adjust quantities
    needs.forEach((item) => {
        let [cartName, cartQuant, cartUnit, key] = item;
        
        // If the item from the fridge matches the cart item
        if (cartName === itemName) {
            cartQuant -= quantity; // Subtract the stored quantity
            
            if (cartQuant > 0) {
                // If there's still some quantity needed, add to newCart
                newCart.push([cartName, cartQuant, cartUnit, key]);
            }
        } else {
            // If it doesn't match, keep the item in the cart
            newCart.push([cartName, cartQuant, cartUnit, key]);
        }
    });
        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(newCart));
    
        console.log("Cart updated after storing item in fridge.");
 }
    

function convertToGrams(unit, quant) 
{
    switch(unit) 
    {
        case 'oz':
            return Math.round(quant * 28.35);
        case 'lbs':
            return Math.round(quant * 453.6);
        case 'g':
            return Math.round(quant);
        default:
            console.error('Unknown unit:', unit);
            return null; 
    }
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
            const [name, fridgeQuant, firdgeUnit] = arr;
            needs.forEach(item =>
                {
                    let [cartName, cartQuant, cartUnit, key] = item;
                    if (cartName === name)
                    {
                        if (cartUnit !== firdgeUnit)
                        {
                            console.error("wrong units");
                        }
                        cartQuant -= fridgeQuant;
                        if (cartQuant <= 0)
                        {
                            //don't add
                        }
                        else
                        {
                            newCart.push([cartName, cartQuant, cartUnit, key])
                        }
                    }
                    else
                    {
                        newCart.push([cartName, cartQuant, cartUnit, key])
                    }
                })
        })
    }
    else
    {
        newCart = needs
    }
    console.log("updating cart");
    localStorage.setItem('cart', JSON.stringify(newCart));
}

function saveItemToLocalStorage(item) 
{
    let items = JSON.parse(localStorage.getItem('items')) || [];
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}

// Retrieve and render recipes from localStorage on page load
function loadItemsFromLocalStorage() 
{
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.forEach(item => {
        // Populate the itemMap?
        // Render the item
        displayItem(item[0],item[1],item[2]);
    });
}

function displayItem(item, quantity, unit)
{
    const addItem = document.getElementById('lastList');
    addItem.insertAdjacentHTML("beforebegin", `<li id ="${getFirstWord(item)}" >
    <section >
        <p1>${item}</p1>
        <p1>${quantity} ${unit}</p1>
        <button class = "remove" onClick = "removeItem(this.parentNode.parentNode.id)">REMOVE</button>
    </section>
</li>`);
}

window.onload = function() 
{
    loadItemsFromLocalStorage();
};
