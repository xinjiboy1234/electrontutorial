function drawContainerRect(cx, x, y, w, h, color) {
    cx.fillStyle = color;
    cx.fillRect(x, y, w, h);
}

function getBackgroundByLevel(level) {
    switch (level) {
        case "A":
            return "#DE291E";
        case "B":
            return "#FFA12D";
        case "C":
            return "#F4E800";
        case "D":
            return "#2FB135";
        case "E":
            return "#4892DD";
        case "F":
            return "#6C207B";
        case "G":
            return "#F18CD2";
        case "H":
            return "#512C1A";
        case "I":
            return "#014631";
        case "J":
            return "#9292CE";
        case "K":
            return "#C3C7C8";
        case "L":
            return "#7ADDD8";
        case "M":
            return "#DE291E";
        case "N":
            return "#DE291E";
        case "O":
            return "#DE291E";
        case "p":
            return "#DE291E";
        case "Q":
            return "#DE291E";
        case "R":
            return "#DE291E";
        case "S":
            return "#DE291E";
        case "T":
            return "#DE291E";
        case "U":
            return "#DE291E";
        case "V":
            return "#DE291E";
        case "W":
            return "#DE291E";
        case "X":
            return "#DE291E";
        case "Y":
            return "#DE291E";
        case "Z":
            return "#DE291E";
        default:
            return "#F2F2F2";

    }
}

function getForegroundByLevel(level) {
    switch (level) {
        case "A":
            return "white";
        case "B":
            return "white";
        case "C":
            return "black";
        case "D":
            return "white";
        case "E":
            return "white";
        case "F":
            return "white";
        case "G":
            return "black";
        case "H":
            return "white";
        case "I":
            return "white";
        case "J":
            return "black";
        case "K":
            return "black";
        case "L":
            return "black";
        case "M":
            return "white";
        case "N":
            return "white";
        case "O":
            return "white";
        case "p":
            return "white";
        case "Q":
            return "white";
        case "R":
            return "white";
        case "S":
            return "white";
        case "T":
            return "white";
        case "U":
            return "white";
        case "V":
            return "white";
        case "W":
            return "white";
        case "X":
            return "white";
        case "Y":
            return "white";
        case "Z":
            return "white";
        default:
            return "white";

    }
}

function drawText(ctx, text, x, y, color) {
    ctx.font = 20 + 'px "Consolas"';
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
}

function drawBin(ctx, x, y, w, h, foreground, background, binText) {
    const binPadding = 5;
    drawContainerRect(ctx, x, y, w, h, "#17b3a3");
    drawContainerRect(ctx, x + binPadding, y, w - binPadding * 2, h - binPadding * 2, background);

    drawText(ctx, binText, w / 2 + x, h / 2 + y, foreground);
}

/**
 * 获取货架结构中的货架宽度和高度
*/
function getRackSize(podData) {
    let sumWidth = 0;
    let sumHeight = 0;

    for (let fi = 0; fi < podData.fieldList.length; fi++) {
        let field = podData.fieldList[fi];
        for (let li = 0; li < field.levelList.length; li++) {
            let level = field.levelList[li];
            if (fi == 0) {
                sumHeight += level.binList[0].height;
            }
            for (let bi = 0; bi < level.binList.length && li === 0; bi++) {
                let bin = level.binList[bi];
                sumWidth += bin.width;
            }
        }
    }

    return {
        width: sumWidth,
        height: sumHeight
    }
}

export default {
    clearRackStructure(ctx, canv) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canv.width, canv.height);
        document.getElementById("podCode").innerText = "";
    },
    drawRack(ctx, canv, podData, positionData) {
        let size = getRackSize(podData);

        const binPadding = 5;

        const containerWidth = canv.width + 10;
        const containerHeight = canv.height + 10;

        ctx.fillStyle = "darkcyan";
        ctx.fillRect(-1 * binPadding, 0, canv.width - (binPadding * 2), containerHeight);

        let widthRate = containerWidth / size.width;
        let heightRate = containerHeight / size.height;
        let fieldSumWidth = 0;
        let sumHeight = 0;

        for (let fi = 0; fi < podData.fieldList.length; fi++) {
            const field = podData.fieldList[fi];
            for (let li = field.levelList.length - 1; li >= 0; li--) {
                const level = field.levelList[li];
                fieldSumWidth = -1 * binPadding;
                for (let bi = 0; bi < level.binList.length; bi++) {
                    const bin = level.binList[bi];
                    let binWidth = bin.width * widthRate;
                    let binHeight = bin.height * heightRate;
                    const binText = level.level + (bi + 1).toString().padStart(2, 0);
                    const fg = "black";
                    const bg = "#f2f2f2";
                    drawBin(ctx, fieldSumWidth, sumHeight, binWidth, binHeight, fg, bg, binText);

                    // 将点位信息存储到内存
                    positionData.set(binText, {
                        binId: bin.id,
                        binText: binText,
                        x: fieldSumWidth,
                        y: sumHeight,
                        w: binWidth,
                        h: binHeight,
                        fg: fg,
                        bg: bg
                    });

                    fieldSumWidth += binWidth;
                }
                sumHeight += level.binList[0].height * heightRate;
            }
        }

        // document.getElementById("podCode").innerText = podData.rackDTO.code;
    },
    // 初始化指定格子的样式
    reset(ctx, positionData, binText) {
        const p = positionData.get(binText);
        drawBin(ctx, p.x, p.y, p.w, p.h, "black", "#f2f2f2", binText);
    },
    // 初始化所有格子的样式
    resetAll(ctx, positionData) {
        for (const key of positionData.keys()) {
            const p = positionData.get(key);
            drawBin(ctx, p.x, p.y, p.w, p.h, "black", "#f2f2f2", key);
        }
    },
    // 高亮格子
    highLight(ctx, positionData, binText) {
        const p = positionData.get(binText);
        drawBin(ctx, p.x, p.y, p.w, p.h, getForegroundByLevel(binText[0]), getBackgroundByLevel(binText[0]), binText);
    }
}