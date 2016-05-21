function SetVisibleDiv(divName) {
    var divNames = ["startup", "gameCreationForm", "gameJoinForm", "canvasesForm"];
    for (var _i = 0, divNames_1 = divNames; _i < divNames_1.length; _i++) {
        var item = divNames_1[_i];
        var divItem = document.getElementById(item);
        if (item === divName) {
            divItem.style.display = "block";
        }
        else {
            divItem.style.display = "none";
        }
    }
}
//# sourceMappingURL=gameutils.js.map