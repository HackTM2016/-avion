function SetVisibleDiv(divName){
    var divItem = <HTMLElement>document.getElementById(divName)
    divItem.style.display = "block"
}

function SetInvisibleDiv(divName){
    var divItem = <HTMLElement>document.getElementById(divName)
    divItem.style.display = "none"
}