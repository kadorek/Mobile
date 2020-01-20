var game;
$(document).ready(function () {
    $(document).on("deviceready", onDeviceReady);
    $(document).on("pause", onPause);
    $(document).on("resume", onResume);
    $(document).on("pagechange", onPageChange);
    document.addEventListener("backbutton", onBackButton);
    game = new Gamex("area", "S", $);
    game.CreateSelectBox("boyutlar");
    game.BindUndoEvent("btnUndo");
    var slc = $("#boyutlar");
    slc.selectmenu("refresh");
    $("#menu > a").button();
    $("#menu > span").button();
    $("#menu > .ui-btn").on("click", function (e) {
        //console.log(e.target);
        var t = $(e.target).children("span");
        //console.log(t.attr("href"));
        $.mobile.navigate(t.attr("href"), { transition: "slideup" });
    })

    $(" #menu span").on("click", function (e) {
        //console.log(e.target);
        var t = $(e.target);
        //console.log(t.attr("href"));
        $.mobile.navigate(t.attr("href"), { transition: "slideup" });
    });

});


function onDeviceReady() {
    console.log("device ready");

    var FileRootPath = cordova.file.dataDirectory;
    //console.log(cordova.file.dataDirectory);
    //var h = new HighScore(cordova.file);      
    document.getElementById("SandBox").innerText = cordova.file.dataDirectory;



}

function onPause() {

}

function onResume() {

}

function onPageChange(e, d) {
    var active = $.mobile.activePage.attr("id");
    //console.log();
    if (active === "GamePlay") {
        game.AddBlocks2();
        game.CreateBoard("color-list");
    }
}


function onBackButton() {
    console.log("back button pressed");
}



function CreateHighScoreFile() {

}

function CheckFileExist() {

}

function WriteHighScore() {
}

