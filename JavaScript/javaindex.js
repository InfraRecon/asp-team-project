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

//Login Form
// Get the modal
var modal = document.getElementById('idLogin');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) 
{
    if (event.target == modal) 
    {
        modal.style.display = "none";
    }
}

//Game Result Form
// Get the modal
var gameModal = document.getElementById('idGameModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) 
{
    if (event.target == gameModal) 
    {
        gameModal.style.display = "none";
    }
}
        
    
//    SlideShow
var slideIndex = 1;
var timer = null;
showSlides(slideIndex);

function plusSlides(n) 
{
    clearTimeout(timer);
    showSlides(slideIndex += n);
}

function currentSlide(n)
{
    clearTimeout(timer);
    showSlides(slideIndex = n);
}

function showSlides(n) 
{
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("dot");

    if (n==undefined)
    {
        n = ++slideIndex
    }
    if (n > slides.length) 
    {
        slideIndex = 1
    }

    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) 
    {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) 
    {
        dots[i].className = dots[i].className.replace(" activedots", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " activedots";
    timer = setTimeout(showSlides, 10000);
}
        
//    SlideShow01      
var slideIndex1 = 1;
var timer1 = null;
showSlides1(slideIndex1);

function plusSlides1(m) 
{
    clearTimeout(timer1);
    showSlides1(slideIndex1 += m);
}

function currentSlide1(m)
{
    clearTimeout(timer1);
    showSlides1(slideIndex1 = m);
}

function showSlides1(m) 
{
    var j;
    var slides1 = document.getElementsByClassName("mySlides1");
    var dots1 = document.getElementsByClassName("dot01");

    if (m==undefined)
    {
        m = ++slideIndex1
    }
    if (m > slides1.length) 
    {
        slideIndex1 = 1
    }

    if (m < 1) {slideIndex1 = slides1.length}
    for (j = 0; j < slides1.length; j++) 
    {
        slides1[j].style.display = "none";
    }

    for (j = 0; j < dots1.length; j++) 
    {
        dots1[j].className = dots1[j].className.replace(" active01", "");
    }
    slides1[slideIndex1-1].style.display = "block";
    dots1[slideIndex1-1].className += " active01";
    timer1 = setTimeout(showSlides1, 20000);
}

//    SlideShow02      
var slideIndex2 = 1;
var timer2 = null;
showSlides2(slideIndex2);

function plusSlides2(m) 
{
    clearTimeout(timer2);
    showSlides2(slideIndex2 += m);
}

function currentSlide2(m)
{
    clearTimeout(timer2);
    showSlides1(slideIndex2 = m);
}

function showSlides2(m) 
{
    var j;
    var slides2 = document.getElementsByClassName("mySlides2");
    var dots2 = document.getElementsByClassName("dot02");

    if (m==undefined)
    {
        m = ++slideIndex2
    }
    if (m > slides2.length) 
    {
        slideIndex2 = 1
    }

    if (m < 1) {slideIndex2 = slides2.length}
    for (j = 0; j < slides2.length; j++) 
    {
        slides2[j].style.display = "none";
    }

    for (j = 0; j < dots2.length; j++) 
    {
        dots2[j].className = dots2[j].className.replace(" active02", "");
    }
    slides2[slideIndex2-1].style.display = "block";
    dots2[slideIndex2-1].className += " active02";
    timer2 = setTimeout(showSlides2, 20000);
}