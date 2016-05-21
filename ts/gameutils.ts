function SetVisibleDiv(divName){
    var divNames = ["startup", "gameCreationForm", "gameJoinForm", "canvasesForm" ]
    for (var item of divNames) {
            var divItem = <HTMLElement>document.getElementById(item)
            if(item === divName){
                divItem.style.display = "block"
            } else {
                divItem.style.display = "none"
            }
    } 
}