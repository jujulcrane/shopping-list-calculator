
const itemInput = document.querySelector('#add-item');
const quantInput = document.querySelector('#add-quant');
const addBut = document.querySelector('.add');
const unitsInput = document.querySelector('#units');

function getFirstWord(inputString) 
{
    var trimmedString = inputString.trim();
    var words = trimmedString.split(" ");
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
    let convertedQuant = convertToGrams(unitsInput.value, quantInput.value)
    const success = saveItemToLocalStorage([itemInput.value.toLowerCase(), convertedQuant, "g"]);
    if (!success) return;
    displayItem(itemInput.value.toLowerCase(), quantInput.value, unitsInput.value);
    updateCartWithStoredItem(itemInput.value.toLowerCase(), convertedQuant);
    itemInput.value ="";
    quantInput.value="";
}

function updateCartWithStoredItem(itemName, quantity) 
{
    let needs = JSON.parse(localStorage.getItem('needs')) || [];
    let newCart = [];
    
    needs.forEach((item) => 
    {
        let [cartName, cartQuant, cartUnit, key] = item;
        
        if (cartName === itemName) 
        {
            cartQuant -= quantity; 
            
            if (cartQuant > 0) 
            {
                newCart.push([cartName, cartQuant, cartUnit, key]);
            }
        } else 
        {
            newCart.push([cartName, cartQuant, cartUnit, key]);
        }
    });
        
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
    if (items.some(otherItem => otherItem[0] === item[0])) 
    {
        alert(`You've already added ${item[0]}! Delete it before readding.`);
        return false;
    }
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
    return true;
}

// Retrieve and render recipes from localStorage on page load
function loadItemsFromLocalStorage() 
{
    const items = JSON.parse(localStorage.getItem('items')) || [];
    items.forEach(item => {
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
