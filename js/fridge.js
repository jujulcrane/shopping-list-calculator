let items = [];
const itemMap = new Map();
let numOfItems = 0;
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
    if (element) {
        element.remove();
        console.log(`Element with id "${id}" removed.`);
    } else {
        console.error(`Element with id "${id}" not found.`);
    }
    //document.getElementById(id).remove();
    itemMap.delete('key2');
    numOfItems--;
    let indexToDelete = -1;
    for (let i = 0; i < items.length; i++)
    {
        if (items[i][0].includes(id))
        {
            indexToDelete = i;
            console.log(indexToDelete);
        }
    }
    if (indexToDelete == -1)
    {
        console.log("ERROR could not delete");
    }
    else
    {
        if (indexToDelete == items.length -1)
        {
            items = items.slice(0,indexToDelete);
        }
        else
        {
            items = items.slice(0,indexToDelete).concat(items.slice(indexToDelete + 1));
        }
    }
    console.log("new items array = " + items);
}

function storeItem() 
{
    items[numOfItems] = [itemInput.value, quantInput.value];
    numOfItems++;
    console.log(items);
    itemMap.set(getFirstWord(itemInput.value), [itemInput.value, quantInput.value]);
    console.log(itemMap);
    displayItem(itemInput.value, quantInput.value, unitsInput.value);
    itemInput.value ="";
    quantInput.value="";
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
