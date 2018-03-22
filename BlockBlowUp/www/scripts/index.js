var game;
$(document).ready(function () {
    $(document).on("deviceready", onDeviceReady);
    $(document).on("pause", onPause);
    $(document).on("resume", onResume);
    $(document).on("pagechange", onPageChange);
    game = new Game("area", "S", $);
    game.CreateSelectBox("boyutlar");
    game.BindUndoEvent("btnUndo");
    var slc = $("#boyutlar");
    slc.selectmenu("refresh");
    $("#menu > a").button();

});


function onDeviceReady() {
    //console.log("dev ready");
    //console.log(game);
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
        game.CreateBoard("color-list")
    }
}