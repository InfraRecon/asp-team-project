//Side nav
function openNav() 
{
    document.getElementById("mySidenav").style.width = "80%";
    document.getElementById("GMlside").style.position="fixed"; 
    document.getElementById("closeButton").style.position="absolute"; 
}

function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("GMlside").style.position="absolute"; 
    document.getElementById("closeButton").style.position="absolute"; 
}

function myFunction() 
{
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") 
    {
        x.className += " responsive";
    } 
    else 
    {
        x.className = "topnav";
    }
}