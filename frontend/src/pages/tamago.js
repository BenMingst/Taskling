// Animation

var petAnimPlaying = false;

function startRockingAnim(obj){
    obj.style.animationPlayState = "running";
    obj.style.animationIterationCount = "infinite";
}

function endRockingAnim(obj){
    obj.style.animationPlayState = "paused";
}

function doRockingAnim(){
    
    if (petAnimPlaying == false){
        petAnimPlaying = true;
        let pet = document.getElementById("PetImage");
        startRockingAnim(pet);
        setTimeout(function(){
            pet.style.animationPlayState = "paused";
            pet.style.animationIterationCount = "0";
            petAnimPlaying = false;
        }, 1750);
    }
}