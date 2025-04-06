var petAnimPlaying = false;
var numCookies = 500;

function updateNum(){
    document.getElementById("CookieCount").textContent = numCookies;
}

function startAnim(obj){
    obj.style.animationPlayState = "running";
}

function doRockingAnim(){
    
    // numCookies+=1;
    // document.getElementById("CookieCount").textContent = numCookies;

    if (petAnimPlaying == false){
        petAnimPlaying = true;
        let pet = document.getElementById("PetImage");
        pet.style.animationIterationCount = "infinite";
        startAnim(pet);
        setTimeout(function(){
            pet.style.animationPlayState = "paused";
            pet.style.animationIterationCount = "0";
            petAnimPlaying = false;
        }, 1750);
    }
}

function doFeedingAnim(){
    if (numCookies > 0){

        numCookies-=1;
        document.getElementById("CookieCount").textContent = numCookies;

        var newCookie = document.createElement("IMG");
        newCookie.setAttribute("src", "../../public/assets/cookie.png");
        newCookie.setAttribute("id", "CookieClone");
        (document.getElementById("Cookie")).appendChild(newCookie);

        startAnim(newCookie);
        setTimeout(function(){
            newCookie.remove();
        }, 1700);
    }
}
