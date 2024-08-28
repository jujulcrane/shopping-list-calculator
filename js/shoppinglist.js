
function loadCartFromLocalStorage()
{
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const listElement = document.querySelector('#list');
    if (!listElement) {
        console.error('Element #empty not found.');
        return;
    }
    const emptyElement = document.querySelector('#empty');
    if (cart.length > 0 && emptyElement)
    {
        emptyElement.parentNode.removeChild(emptyElement);
    }
    cart.forEach(item =>
        {
            let [cartName, cartQuant, cartUnit] = item;
            let html = `<li class = "item"> 
                <h1>${cartQuant}${cartUnit} ${cartName}</h1>
                <input class = "check" type="checkbox">
            </li>`;
            listElement.insertAdjacentHTML('beforeend', html);
        })
}

window.onload = function() 
{
    loadCartFromLocalStorage();
};


