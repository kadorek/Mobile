﻿class Game {
    static get AvaliableSizes() {
        return [
            new GameSize("S", 90, 50, 6, 8),
            new GameSize("M", 90, 50, 8, 7),
            new GameSize("L", 90, 50, 9, 8),
            new GameSize("XL", 90, 60, 10, 9)
        ];
    }
    constructor(areaId, gameSize) {
        //console.log("game const");
        this.body = document.getElementsByTagName("body")[0];
        this.previousState = null;
        this.selectedBlocks = [];
        this.TypeCount = 5;
        this.TypeCounts = [0, 0, 0, 0, 0];
        this.blockTypes = [
            { color: "red", letter: "" },
            { color: "green", letter: "" },
            { color: "blue", letter: "" },
            { color: "orange", letter: "" },
            { color: "brown", letter: "" }
        ];
        this.Size = null;
        this.AreaElement = document.getElementById(areaId);
        if (gameSize != null) {
            for (var i = 0; i < Game.AvaliableSizes.length; i++) {
                if (gameSize == Game.AvaliableSizes[i].Name) {
                    this.Size = Game.AvaliableSizes[i];
                    break;
                }
            }
            this.SetArea(this.Size);
        }
        //this.AddBlocks2();
        window.addEventListener("resize", (e) => this.ResizeBlocks());
        window.addEventListener("keypress", function (e) {
            // body... 
            var evtobj = window.event ? event : e
            if (evtobj.keyCode == 13 && evtobj.ctrlKey) {
                this.SlideTheScreen("End", "container");
            }
        })
    }
    SetArea(size) {
        this.AreaElement.style.width = size.AreaSizeW + "%";
        this.AreaElement.style.height = size.AreaSizeH + "%";
    }
    OrganizeCounts(size) {
        var totalCount = size.RowCount * size.ColCount;
        var randomProp = Math.floor(totalCount / 10);
        totalCount -= randomProp;
        var ext = totalCount % this.TypeCount;
        var minTypeCount = (totalCount - ext) / this.TypeCount;
        randomProp += ext;
        for (var k = 0; k < this.TypeCount; k++) {
            var rnd = 0;
            if (randomProp > 0) { rnd = this.RandomIntFromInterval(0, randomProp); }
            this.TypeCounts[k] = minTypeCount + rnd;
            randomProp -= rnd;
        }
        if (randomProp > 0) {
            this.TypeCounts[this.RandomIntFromInterval(0, this.TypeCount - 1)] += randomProp;
        }
    }
    AddBlocks() {
        var aH = Number(this.AreaElement.offsetHeight);
        var aW = Number(this.AreaElement.offsetWidth);
        var r = this.Size.RowCount;
        var c = this.Size.ColCount;
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                var b = document.createElement("div");
                b.setAttribute("row", i);
                b.setAttribute("col", j);
                b.setAttribute("selected", 0);
                b.id = "b_" + i + "_" + j;
                b.className = "block";
                this.AreaElement.appendChild(b);
                b.style.left = (aW / this.Size.ColCount) * j;
                b.style.top = (aH / this.Size.RowCount) * i;
                b.style.width = aW / this.Size.ColCount;
                b.style.height = aH / this.Size.RowCount;
                var typeIndex = this.RandomIntFromInterval(0, this.blockTypes.length - 1);
                b.setAttribute("color", this.blockTypes[typeIndex].color);
                b.setAttribute("top", b.style.top);
                b.style.backgroundColor = b.getAttribute("color");
                b.innerText = this.blockTypes[typeIndex].letter;
                let pr = new Proxy(this, this.BlockClick);
                b.addEventListener("click", (e) => this.BlockClick(e));
            }
        }
    }
    AddBlocks2() {
        this.OrganizeCounts(this.Size);
        var aH = Number(this.AreaElement.offsetHeight);
        var aW = Number(this.AreaElement.offsetWidth);
        var r = this.Size.RowCount;
        var c = this.Size.ColCount;
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                var b = document.createElement("div");
                b.setAttribute("row", i);
                b.setAttribute("col", j);
                b.setAttribute("selected", 0);
                b.id = "b_" + i + "_" + j;
                b.className = "block prevent-select";
                this.AreaElement.appendChild(b);
                b.style.left = ((aW / this.Size.ColCount) * j) + "px";
                b.style.top = ((aH / this.Size.RowCount) * i) + "px";
                b.style.width = aW / this.Size.ColCount + "px";
                b.style.height = aH / this.Size.RowCount + "px";
                //b.style.width = 100 / this.Size.ColCount + "px";
                //b.style.height = 100 / this.Size.RowCount + "px";
                var typeIndex = -1;
                do {
                    // statement
                    typeIndex = this.RandomIntFromInterval(0, this.TypeCount - 1);
                } while (this.TypeCounts[typeIndex] == 0);
                this.TypeCounts[typeIndex] -= 1;
                b.setAttribute("color", this.blockTypes[typeIndex].color);
                b.setAttribute("top", b.style.top);
                b.style.backgroundColor = b.getAttribute("color");
                b.innerText = this.blockTypes[typeIndex].letter;
                let pr = new Proxy(this, this.BlockClick);
                b.addEventListener("click", (e) => this.BlockClick(e));
            }
        }
    }
    ResizeBlocks() {
        var bls = document.getElementsByClassName("block");
        var aH = Number(this.AreaElement.offsetHeight);
        var aW = Number(this.AreaElement.offsetWidth);
        for (var i = 0; i < bls.length; i++) {
            var bx = bls[i];
            bx.style.left = (aW / this.Size.ColCount) * Number(bx.getAttribute("col"));
            bx.style.top = (aH / this.Size.RowCount) * Number(bx.getAttribute("row"));
            bx.style.width = aW / this.Size.ColCount;
            bx.style.height = aH / this.Size.RowCount;
        }
    }
    RandomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    RemoveBlocks(arr) {
        console.log("block removes")
        let rowIndex = -1;
        let colIndex = -1;
        this.MemorizeBlocks();
        var removedItemCount = 0;
        var removedCols = [];
        //var a = document.getElementById("area");
        var aH = Number(this.AreaElement.offsetHeight);
        var aW = Number(this.AreaElement.offsetWidth);
        for (var i = 0; i < arr.length; i++) {
            var x = document.getElementById(arr[i]);
            if (x == null) { continue; }
            if (removedCols.indexOf(x.getAttribute("col")) < 0) {
                removedCols.push(x.getAttribute("col"));
            }
            x.parentNode.removeChild(x);
            removedItemCount++;
        }
        //block aşağı kaydırmak için
        for (var i = 0; i < removedCols.length; i++) {
            var obj = document.querySelectorAll('[col="' + removedCols[i] + '"]');
            rowIndex = this.Size.RowCount - 1;
            colIndex = this.Size.ColCount - 1;
            for (var j = obj.length - 1; j >= 0; j--) {
                var y = obj[j];
                y.setAttribute("row", rowIndex);
                y.style.top = (aH / this.Size.RowCount * rowIndex)+"px";
                y.setAttribute("id", "b_" + (rowIndex--) + "_" + removedCols[i]);
            }
        }
        //
        //sutun kaydırmak için
        var rCNumbers = removedCols.map(Number);
        var minCol = rCNumbers.min();
        var unEmptyColumns = [];
        for (var i = minCol; i < this.Size.ColCount; i++) {
            var obj = document.querySelectorAll('[col="' + i + '"]');
            if (obj.length > 0) {
                unEmptyColumns.push(i);
            }
        }
        for (var i = 0; i < unEmptyColumns.length; i++) {
            //unEmptyColumns[i]
            var obj = document.querySelectorAll('[col="' + unEmptyColumns[i] + '"]');
            for (var j = 0; j < obj.length; j++) {
                var bx = obj[j];
                bx.setAttribute("col", minCol + i);
                bx.style.left =( Number(bx.getAttribute("col")) * aW / this.Size.ColCount)+"px";
                var bxr = bx.getAttribute("row");
                bx.setAttribute("id", "b_" + bxr + "_" + (minCol + i));
            }
        }
    }
    CreateBoard(colorListId) {
        this.listId = colorListId;
        var cList = document.getElementById(colorListId);
        //cList.style.float = 'left';
        cList.innerHTML = "";
        for (var i = 0; i < this.blockTypes.length; i++) {
            var item = document.createElement("div");
            item.className = "color-indicator";
            item.style.color = this.blockTypes[i].color;
            var itemCount = document.createElement("span");
            itemCount.innerText = document.querySelectorAll("[color='" + this.blockTypes[i].color + "']").length;
            item.innerText = this.blockTypes[i].color + "\t";
            item.appendChild(itemCount);
            cList.appendChild(item);
        }
    }
    BlockClick(event) {
        console.log("block click")
        var stack = [];
        var b = event.target;
        if (this.selectedBlocks.indexOf(b.getAttribute("id")) > -1) {
            this.Animate(this.selectedBlocks);
            this.RemoveBlocks(this.selectedBlocks);
            this.WriteScore2(event.target, this.selectedBlocks.length, true);
            this.selectedBlocks = [];
            return;
        } else {
            this.ReColorBlocks(this.selectedBlocks);
            this.selectedBlocks = [];
        }
        stack.push(b);
        while (stack.length > 0) {
            var x = stack.pop();
            x.style.backgroundColor = "purple";
            x.setAttribute("selected", 1);
            if (this.selectedBlocks.indexOf(x.getAttribute("id")) >= 0) {
                continue;
            }
            this.selectedBlocks.push(x.getAttribute("id"));
            var row = Number(x.getAttribute("row"));
            var col = Number(x.getAttribute("col"));
            var left = col - 1;
            var right = col + 1;
            var up = row - 1;
            var down = row + 1;
            var leftBlock = document.getElementById("b_" + row + "_" + left);
            var rightBlock = document.getElementById("b_" + row + "_" + right);
            var upBlock = document.getElementById("b_" + up + "_" + col);
            var downBlock = document.getElementById("b_" + down + "_" + col);
            if (leftBlock != null && leftBlock.getAttribute("color") == b.getAttribute("color") && leftBlock.getAttribute("selected") != "1") {
                stack.push(leftBlock);
            }
            if (rightBlock != null && rightBlock.getAttribute("color") == b.getAttribute("color") && rightBlock.getAttribute("selected") != "1") {
                stack.push(rightBlock);
            }
            if (upBlock != null && upBlock.getAttribute("color") == b.getAttribute("color") && upBlock.getAttribute("selected") != "1") {
                stack.push(upBlock);
            }
            if (downBlock != null && downBlock.getAttribute("color") == b.getAttribute("color") && downBlock.getAttribute("selected") != "1") {
                stack.push(downBlock);
            }
        }
        if (this.selectedBlocks.length == 1) {
            this.ReColorBlocks(this.selectedBlocks);
            this.selectedBlocks = [];
        }
    }
    ReColorBlocks(arr) {
        for (var i = 0; i < arr.length; i++) {
            var x = document.getElementById(arr[i]);
            if (x == null) { continue; }
            x.style.backgroundColor = x.getAttribute("color");
            x.setAttribute("selected", "0");
        }
    }
    WriteScore(scoreToAdd, add) {
        var spn = document.getElementById("score");
        var cBN = document.getElementById("clearedBlockNumber");
        var oldScore = Number(spn.innerText);
        if (add) {
            spn.innerText = (oldScore + Math.pow(2, (scoreToAdd - 1)));
            cBN.innerText = (Number(cBN.innerText) + scoreToAdd);
        } else {
            spn.innerText = (oldScore - Math.pow(2, (scoreToAdd - 1)));
            cBN.innerText = (Number(cBN.innerText) - scoreToAdd);
        }
        this.CreateBoard(this.listId);
        this.FinishControl();
    }
    WriteScore2(clickedObject, scoreToAdd, add) {

        var _score = Math.pow(2, (scoreToAdd - 1));
        /********/
        var cloneArea = this.AreaElement.cloneNode();
        cloneArea.style.top = this.AreaElement.offsetTop;
        cloneArea.style.left = this.AreaElement.offsetLeft;
        cloneArea.style.backgroundColor = "transparent";

        cloneArea.style.position = "absolute";
        cloneArea.setAttribute("id", "sc" + this.AreaElement.id)
        cloneArea.style.zIndex = '2002';
        document.getElementsByTagName("body")[0].appendChild(cloneArea);

        var _divText = document.createElement("div");
        var _textNode = document.createTextNode("+" + _score);
        _divText.appendChild(_textNode);
        cloneArea.appendChild(_divText);
        /********/
        var spn = document.getElementById("score");
        var cBN = document.getElementById("clearedBlockNumber");
        var oldScore = Number(spn.innerText);
        if (add) {
            _divText.className = "prevent-select ";
            spn.innerText = (oldScore + _score);
            cBN.innerText = (Number(cBN.innerText) + scoreToAdd);

            var oL = clickedObject.style.left;
            var oT = clickedObject.style.top;

            _divText.style.left = oL;
            _divText.style.top = oT;
            _divText.addEventListener("transitionend", function (e) {
                if (e.propertyName == "transform") {
                    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
                }
            })
            _divText.style.position = 'absolute';
            _divText.style.color = "white";
            _divText.style.fontWeight = 'bold';
            _divText.style.fontSize = 'xx-large';
            _divText.className += "scale-anim";
            _divText.style.transform = 'scale(3,3)';
            _divText.style.opacity = '0.4';
        } else {
            spn.innerText = (oldScore - _score);
            cBN.innerText = (Number(cBN.innerText) - scoreToAdd);
        }
        this.CreateBoard(this.listId);
        //this.FinishControl();
    }
    FinishControl() {
        var durum = true;
        var sayac = 0;
        var blcks = document.getElementsByClassName("block")
        for (var i = 0; i < blcks.length; i++) {
            var x = blcks[i];
            var xR = x.getAttribute("row");
            var xC = x.getAttribute("col");
            var rI = Number(x.getAttribute("row"));
            var cI = Number(x.getAttribute("col"));
            var neighboorIds = [
                "b_{0}_{1}".format(xR, cI - 1),
                "b_{0}_{1}".format(xR, cI + 1),
                "b_{0}_{1}".format(rI - 1, xC),
                "b_{0}_{1}".format(rI + 1, xC)
            ];
            var xColor = x.getAttribute("color");
            for (var j = 0; j < neighboorIds.length; j++) {
                let xN = document.getElementById(neighboorIds[j]);
                if (xN == null) { continue; }
                if (xN.getAttribute("color") == xColor) {
                    durum = true;
                    sayac++;
                }
                durum = false;
            }
        }
        if (sayac == 0) {
            //alert("bitti");
            this.Wait(1000);
            this.SlideTheScreen("End", "container");
        }
    }
    MemorizeBlocks() {
        this.previousState = document.getElementById("area").innerHTML;
    }
    BindUndoEvent(controlId) {
        var c = document.getElementById(controlId);
        c.addEventListener("click", (e) => { this.UndoClick(e) });
    }
    UndoClick(event) {
        if (this.previousState == null) { return; }
        this.AreaElement.innerHTML = this.previousState;
        this.previousState = null;
        var _bs = document.querySelectorAll(".block[selected='1']");
        for (var i = 0; i < _bs.length; i++) {
            _bs[i].style.backgroundColor = _bs[i].getAttribute("color");
            _bs[i].setAttribute("selected", "0");
        }
        var _blxs = document.getElementsByClassName("block")
        for (var i = 0; i < _blxs.length; i++) {
            _blxs[i].addEventListener("click", (e) => { this.BlockClick(e) });
        }
        this.WriteScore(_bs.length, false);
    }
    SelectChange(event) {
        var slc = event.target;
        var choosenSizeName = (slc.value || slc.options[slc.selectedIndex].value)
        for (var i = 0; i < Game.AvaliableSizes.length; i++) {
            if (choosenSizeName == Game.AvaliableSizes[i].Name) {
                this.Size = Game.AvaliableSizes[i];
                break;
            }
        }
        this.SetArea(this.Size);
        this.AreaElement.innerHTML = "";
        this.AddBlocks();
    }
    CreateSelectBox(boxId) {
        var s = document.getElementById(boxId);
        for (var i = 0; i < Game.AvaliableSizes.length; i++) {
            var opt = document.createElement("option");
            opt.innerText = Game.AvaliableSizes[i].Name + "(" + Game.AvaliableSizes[i].RowCount + "X" + Game.AvaliableSizes[i].ColCount + ")";
            opt.setAttribute("value", Game.AvaliableSizes[i].Name)
            if (this.Size.Name == opt.getAttribute("value")) { opt.setAttribute("selected", "selected") }
            s.appendChild(opt);
            //Game.AvaliableSizes[i]
        }
        s.addEventListener("change", (e) => this.SelectChange(e));
    }
    Animate(blockList) {

        var cloneArea = this.AreaElement.cloneNode();
        cloneArea.style.top = this.AreaElement.offsetTop;
        cloneArea.style.left = this.AreaElement.offsetLeft;
        cloneArea.style.backgroundColor = "transparent";
        cloneArea.style.position = "absolute";
        cloneArea.setAttribute("id", "c" + this.AreaElement.id)
        cloneArea.style.zIndex = '1000';
        document.getElementsByTagName("body")[0].appendChild(cloneArea);
        for (var i = 0; i < blockList.length; i++) {
            // statements
            var node = document.getElementById(blockList[i]);
            var cNode = node.cloneNode(true);
            cloneArea.appendChild(cNode);
            if (i == blockList.length - 1) {
                /*cNode.addEventListener("transitionend", function(e) {
                    if (e.propertyName == "top") {
                        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
                    }
                });*/
                cNode.addEventListener("transitionend", (e) => {
                    //function (e) {
                    if (e.propertyName == "top") {
                        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
                    }
                    //}

                    this.FinishControl();
                });


            }
            cNode.setAttribute("id", "c" + blockList[i]);
            cNode.removeAttribute("col");
            cNode.removeAttribute("row");
            cNode.style.top = node.offsetTop;
            cNode.style.opacity = "0.1";
            cNode.className = cNode.className + " anim";
            cNode.style.top = Number(node.offsetTop - 200) + "px";
        }
    }
    Wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }
    SlideTheScreen(targetId, containerId) {
        var t = document.getElementById(targetId)
        var con = document.getElementById(containerId);
        //this.Wait(waitMs);
        con.style.top = "-" + (t.offsetTop + 10) + "px";
    }

}
class GameSize {
    constructor(name, areaSizeW, areaSizeH, rowCount, colCount) {
        this._Name = name;
        this._AreaSizeW = areaSizeW;
        this._AreaSizeH = areaSizeH;
        this._RowCount = rowCount;
        this._ColCount = colCount;
    }
    get Name() {
        return this._Name;
    }
    get AreaSizeH() {
        return this._AreaSizeH;
    }
    get AreaSizeW() {
        return this._AreaSizeW;
    }
    get RowCount() {
        return this._RowCount;
    }
    get ColCount() {
        return this._ColCount;
    }
}
class ExtensionMethods {
    //To DO
}