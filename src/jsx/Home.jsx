"use strict";

import React from 'react';
import { api } from "os-npm-util/client";

import sprites from "../js/sprites.json"

import "../style/Home.less"

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            woth: [],
            barren: [],
            hints: [],
            hint: ["", ""],
        }
        this.selectRefs = [];
        this.divRefs = [];
        this.assignSelectRef = (ind, r) => {
            r ? this.selectRefs[ind] = r : null;
        }
        this.assignDivRef = (ind, r) => {
            r ? this.divRefs[ind] = r : null;
        }
        this.createColumn = this.createColumn.bind(this)
        this.zoneDropdown = this.zoneDropdown.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.selectionChange = this.selectionChange.bind(this)
        this.changeImage = this.changeImage.bind(this)
    }

    componentDidMount() {
        //console.log(this.selectRefs)
    }

    serverCall() {
        api.get(`/test`, (res) => {
            if(res.status) {
                // Do something
            }
            else {
                // Handle error
            }
        })
    }

    zoneDropdown(stateArr, options) {
        let optionsArr = options.map((optionItem, ind2) => {
            return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} className={"selectBox"}>
                <select className={"zone"} value={""} onChange={this.addItem.bind(this, stateArr)}>{optionsArr}</select>
            </div>
        )
        let list = this.state[stateArr].map((zone, i) => {
            return (
                <div key={i} className={"selectBox"}>
                    <select className={"zone"} value={zone} disabled>{optionsArr}</select>
                    <div>
                        <button className={"delete"} onClick={this.removeItem.bind(this, i, stateArr)}>X</button>
                    </div>
                </div>
            )
        })
        list.push(dropdown)
        return list;
    }

    hintDropdown(stateArr, miscHints, miscItems) {
        let miscHintsOpts = miscHints.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let miscItemsOpts = miscItems.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} >
                <select value={this.state.hint[0]} onChange={this.updateHint.bind(this, 0)}>{miscHintsOpts}</select>
                <select value={this.state.hint[1]} onChange={this.updateHint.bind(this, 1)}>{miscItemsOpts}</select>
                <button onClick={this.addHint.bind(this, stateArr)}>Add</button>
            </div>
        )

        let list = this.state[stateArr].map((hint, i) => {
            return (
                <div key={i} style={{display: "flex"}}>
                    <select style={{background: "white"}} value={hint[0]} disabled>{miscHintsOpts}</select>
                    <select style={{background: "white"}} value={hint[1]} disabled>{miscItemsOpts}</select>
                    <div>
                        <button onClick={this.removeItem.bind(this, i, stateArr)}>X</button>
                    </div>
                </div>
            )
        })
        list.push(dropdown)
        return list;
    }

    updateHint(ind, e) {
        let val = e.target.value
        let currentHint = ind === 0 ? val : this.state.hint[0];
        let currentItem = ind === 1 ? val : this.state.hint[1];
        let updatedHint = [currentHint, currentItem]
        this.setState({hint: updatedHint})
    }

    addHint(stateArr, e) {
        let hint = this.state.hint
        let currentArr = this.state[stateArr].slice();
        currentArr.push(hint)
        this.setState({[stateArr]: currentArr, hint: ["", ""]})
    }

    addItem(stateArr, e) {
        let val = e.target.value
        let currentArr = this.state[stateArr].slice();
        currentArr.push(val)
        this.setState({[stateArr]: currentArr}, () => {
            this.selectionChange()
        })
    }

    removeItem(i, stateArr) {
        let currentArr = this.state[stateArr].slice();
        currentArr.splice(i, 1)
        this.setState({[stateArr]: currentArr}, () => {
            this.selectionChange()
        })
    }

    selectionChange() {
        this.selectRefs.forEach((ref, ind) => {
            let div = this.divRefs[ind]
            if(this.state.woth.some((way) => way === ref.value)) {
                !div.className.match("woth") && (div.className += " woth")
            }
            else {
                div.className = div.className.replace(" woth", "")
            }
        })
    }

    changeImage(e, i) {
        let title = e.target.title
        let newTitle = title
        if(e.target.style.opacity > 0.7) {
            switch(title) {
                case "Sling": newTitle = "Sling2"; break;
                case "Sling2": newTitle = "Sling3"; break;
                case "Sling3": newTitle = "Sling"; break;

                case "Bombs": newTitle = "Bombs2"; break;
                case "Bombs2": newTitle = "Bombs3"; break;
                case "Bombs3": newTitle = "Bombs"; break;

                case "Scale": newTitle = "Scale2"; break;
                case "Scale2": newTitle = "Scale"; break;

                case "Strength": newTitle = "Strength2"; break;
                case "Strength2": newTitle = "Strength3"; break;
                case "Strength3": newTitle = "Strength"; break;

                case "Hookshot": newTitle = "Hookshot2"; break;
                case "Hookshot2": newTitle = "Hookshot"; break;

                case "Bottle": newTitle = "Bottle2"; break;
                case "Bottle2": newTitle = "Bottle3"; break;
                case "Bottle3": newTitle = "Bottle4"; break;
                case "Bottle4": newTitle = "Bottle"; break;

                case "Bow": newTitle = "Bow2"; break;
                case "Bow2": newTitle = "Bow3"; break;
                case "Bow3": newTitle = "Bow"; break;

                case "Wallet": newTitle = "Wallet2"; break;
                case "Wallet2": newTitle = "Wallet"; break;

                case "Magic": newTitle = "Magic2"; break;
                case "Magic2": newTitle = "Magic"; break;
            }
        }

        e.target.style.opacity > 0.7 && !newTitle.match(/\d/) ? e.target.style.opacity = 0.40 : e.target.style.opacity = 1
        e.target.title = newTitle
        e.target.src = `data:image/png;base64,${sprites[newTitle+".txt"]}`
    }

    createColumn(colType, list, options, multi_options = []) {
        let styles = {
            songs: {row: "songRow", name: "songLocation", options: "songName"},
            items: {row: "itemRow", name: "itemName", options: "zone"},
            medals: {row: "medalRow", name: "medalName", options: "medalZone"},
        }

        let rows = list.map((listItem, ind) => {
            let optionsArr = options.map((optionItem, ind2) => {
                return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
            })

            let selection = (
                <div className={"selectionContainer"}>
                    <select ref={colType === "items" && this.assignSelectRef.bind(this, ind)}
                    className={ styles[colType].options }
                    onChange={this.selectionChange}>{optionsArr}
                    </select>
                </div>
            )

            multi_options.forEach((multi_option) => {
                if(multi_option.name === listItem) {
                    selection = [...Array(multi_option.num)].map((e, i) => {
                        return (
                            <div key={i} className={"selectionContainer"}>
                                <select ref={colType === "items" && i === 0 && this.assignSelectRef.bind(this, ind)}
                                className={ styles[colType].options }
                                onChange={this.selectionChange}>{optionsArr}</select>
                            </div>)
                    })
                }
            })

            return (
                <div className={ `${styles[colType].row}` } key={ind} ref={colType == "items" && this.assignDivRef.bind(this, ind)}>
                    <span className={ styles[colType].name }>
                        <img style={{opacity: "40%"}} title={listItem}
                        onClick={this.changeImage}
                        src={`data:image/png;base64,${sprites[listItem+".txt"]}`} />
                    </span>
                    {selection}
                </div>
            );
        })
        return rows;
    }

    render() {

        let songLocations = ["", "Start", "LLR", "Windmill", "C Saria", "A Saria",
            "DMC", "Composer", "ToT", "Ice", "Colo", "Kak", "OOT"];
        let songNames = ["Lullaby", "Epona", "Saria", "Sun", "Time", "Storms",
            "Forest", "Fire", "Water", "Spirit", "Shadow", "Light"];
        let songRows = this.createColumn("songs", songNames, songLocations);


        let itemNames = ["Boomer", "Hammer", "Rutos", "Mirror", "L Arrow", "F Arrow",  "Dins", "Hovers", "Irons", "Goron", "Zora",
            "Lens", "Bombchu", "Sling", "Bombs", "Scale", "Strength", "Hookshot", "Bottle", "Bow", "Magic", "Wallet"]
        let zones = ["", "K Forest", "LW", "H Field", "Market", "LLR", "Kak",
            "Graveyard", "DM Trail", "DM Crater", "Goron City", "Z River", "Z Fountain", "Z Domain",
            "L Hylia", "G Valley", "G Fortress", "Colossus", "Deku", "Dodongo", "Jabu", "BotW",
            "Forest", "Fire", "Water", "Shadow", "Spirit", "Ice", "GTG", "G Castle",
            "ToT", "HC", "Wasteland", "OGC", "SFM"];
        let multi_options = [{name:"Sling", num:3}, {name:"Bombs", num:3}, {name:"Scale", num:2},
            {name:"Strength", num:3}, {name:"Hookshot", num:2}, {name:"Bottle", num:3}, {name:"Bow", num:3},
            {name:"Magic", num:2}, {name:"Wallet", num:2}];
        let itemRows = this.createColumn("items", itemNames, zones, multi_options);


        let medallions = ["Forest_Medal", "Fire_Medal", "Water_Medal", "Spirit_Medal", "Shadow_Medal", "Light_Medal",
        "Forest_Stone", "Fire_Stone", "Water_Stone"]
        let medal_zones = ["????", "FREE", "DEKU", "DODO", "JABU", "FRST", "FIRE", "WATR", "SPRT", "SHDW"]
        let medalRows = this.createColumn("medals", medallions, medal_zones);


        let miscHints = ["", "LW: Skull Mask", "Market: Chest", "Kak: Cuccos", "GY: Sun", "GY: Flame", "DMT: Biggoron", "GC: Hammer", "GC: Dance", "GC: Pottery", "ZR: Final Frog", "ZF: Under Ice", "ZD: Unfreeze", "L Hylia: Sun", "GV: Hammer", "FT: Pierre", "FT: Top Flare", "WT: Boulder", "WT: River", "Spirit: ColoLH", "Spirit: ColoRH", "Shadow: Invis Maze", "GTG: Sunken", "GTG: Final Thieves", "BotW: DeadHand"]
        let miscItems = ["", "Dead", "SM Key", "Boss Key", ...itemNames]

        return (
            <div id="component-home">
                <div style={{display: "flex"}}>
                    <div>
                        <h3>Songs</h3>
                        <div id="songs" className={"col"}>
                            {songRows}
                        </div>
                    </div>
                    <div>
                        <h3>Items</h3>
                        <div id="items" className={"col"}>
                            {itemRows}
                        </div>
                    </div>
                </div>

                <div style={{display: "flex", margin: "10px 10px"}}>
                    {medalRows}
                </div>

                <div style={{display: "flex"}}>
                    <div className={"zoneLists"}>
                        <h3>Way of the Hero</h3>
                        <div>
                            {this.zoneDropdown("woth", zones)}
                        </div>
                    </div>
                    <div className={"zoneLists"}>
                        <h3>Barren</h3>
                        <div>
                            {this.zoneDropdown("barren", zones)}
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Misc Hints</h3>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div>
                            {this.hintDropdown("hints", miscHints, miscItems)}
                        </div>
                        <textarea style={{margin: "0 10px"}} rows="9" cols="40"></textarea>
                    </div>
                </div>
            </div>
        );
    }

}

export { Home as default };
