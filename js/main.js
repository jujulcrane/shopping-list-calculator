const burgerBtn = document.querySelector(".navbutton");
const navMenu = document.querySelector("#nav-block");
const burgerImg = document.querySelector("#navImg");

let isMenuOpen = false;

burgerBtn.onclick = function()
{
    if (!isMenuOpen)
    {
        navMenu.style.display = "block";
        burgerImg.src = "../shopping-list-calculator/images/closedBurger.png";
        isMenuOpen = true;
    }
    else if (isMenuOpen)
    {
        navMenu.style.display = "none";
        burgerImg.src = "../shopping-list-calculator/images/Mask groupnavmenu.png";
        isMenuOpen = false;
    }
}