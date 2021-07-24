"use strict";

const fs = require("fs");
const sharp = require("sharp");

const spriteFile = require("./sprites.json")

const rawFileDir = "/home/app/src/imgraw"
const fmtFileDir = "/home/app/src/imgfmt"
const outputPath = "/home/app/src/js/sprites.json"

let spriteHeight = 32;
let spriteWidth = 32;
let spriteSize = {
    "Bombs": {w:26,h:29},
    "Bottle": {w:27,h:34},
    "Bow": {w:34,h:33},
    "Dins": {w:28,h:33},
    "Hovers": {w:29,h:31},
    "Hammer": {w:33,h:32},
    "Wallet": {w:26,h:34},
}

let spriteArr = []

fs.promises.readdir(fmtFileDir).then((fmtfiles) => {
    console.log("fmtFiles", fmtfiles)

    fs.promises.readdir(rawFileDir).then((rawfiles) => {
        let filesToConvert = rawfiles.length

        rawfiles.forEach((rawfilename, ind) => {
            let fmtname = rawfilename.replace(/\..+$/g, "");
            let basename = fmtname.replace(/\d/, "");
            let fmtfilename = fmtname+".txt";
            let rawFilePath = `${rawFileDir}/${rawfilename}`
            let fmtFilePath = `${fmtFileDir}/${fmtfilename}`
            let base64Data = spriteFile[fmtfilename]

            if(!fmtfiles.some((file) => file === `${fmtfilename}`) || !base64Data) {
                let dimensions = {
                    w: spriteSize[basename] ? spriteSize[basename].w : spriteWidth,
                    h: spriteSize[basename] ? spriteSize[basename].h : spriteHeight,
                }
                sharp(rawFilePath).resize(dimensions.w, dimensions.h).toBuffer((err, data, info) => {
                    base64Data = data.toString("base64")
                    fs.writeFileSync(fmtFilePath, base64Data)
                    spriteArr.push(`"${fmtfilename}": "${base64Data}"`)
                    --filesToConvert === 0 && writeToFile()
                })
            }
            else {
                spriteArr.push(`"${fmtfilename}": "${base64Data}"`)
                --filesToConvert === 0 && writeToFile()
            }
        })
    })
})


function writeToFile() {
    let newSprites = fs.createWriteStream(outputPath)
    let spriteStr = spriteArr.join(",\n")
    newSprites.write("{\n")
    newSprites.write(spriteStr)
    newSprites.write("\n}")
}
