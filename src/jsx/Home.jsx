"use strict";

import React from 'react';
import { api } from "os-npm-util/client";

import sprites from "../js/sprites.json"

import "../style/Home.less"

const songLocations = ["", "Start", "LLR", "Windmill", "C Saria", "A Saria",
    "DMC", "Composer", "ToT", "Ice", "Colo", "Kak", "OOT"];
const songNames = ["Lullaby", "Epona", "Saria", "Sun", "Time", "Storms",
    "Forest", "Fire", "Water", "Spirit", "Shadow", "Light"];
const itemNames = ["Boomer", "Hammer", "Rutos", "Mirror", "L Arrow", "F Arrow",  "Dins", "Hovers", "Irons", "Goron", "Zora",
    "Lens", "Bombchu", "Sling", "Bombs", "Scale", "Strength", "Hookshot", "Bottle", "Bow", "Magic", "Wallet"]
const zones = ["", "K Forest", "LW", "H Field", "Market", "LLR", "Kak",
    "Graveyard", "DM Trail", "DM Crater", "Goron City", "Z River", "Z Fountain", "Z Domain",
    "L Hylia", "G Valley", "G Fortress", "Colossus", "Deku", "Dodongo", "Jabu", "BotW",
    "Forest", "Fire", "Water", "Shadow", "Spirit", "Ice", "GTG", "G Castle",
    "ToT", "HC", "Wasteland", "OGC", "SFM"];
const multi_options = [{name:"Sling", num:3}, {name:"Bombs", num:3}, {name:"Scale", num:2},
    {name:"Strength", num:3}, {name:"Hookshot", num:2}, {name:"Bottle", num:3}, {name:"Bow", num:3},
    {name:"Magic", num:2}, {name:"Wallet", num:2}];
const medallions = ["Forest_Medal", "Fire_Medal", "Water_Medal", "Spirit_Medal", "Shadow_Medal", "Light_Medal",
"Forest_Stone", "Fire_Stone", "Water_Stone"]
const medal_zones = ["????", "FREE", "DEKU", "DODO", "JABU", "FRST", "FIRE", "WATR", "SPRT", "SHDW"]
const miscHints = ["", "LW: Skull Mask", "Market: Chest", "Kak: Cuccos", "GY: Sun", "GY: Flame", "DMT: Biggoron", "GC: Hammer", "GC: Dance", "GC: Pottery", "ZR: Final Frog", "ZF: Under Ice", "ZD: Unfreeze", "L Hylia: Sun", "GV: Hammer", "FT: Pierre", "FT: Top Flare", "WT: Boulder", "WT: River", "Spirit: ColoLH", "Spirit: ColoRH", "Shadow: Invis Maze", "GTG: Sunken", "GTG: Final Thieves", "BotW: DeadHand"]
const miscItems = ["", "Dead", "SM Key", "Boss Key", ...itemNames]

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            useSimple: false,
            woth: [],
            barren: [],
            hints: [],
            hint: ["", ""],
            "auth-email": this.getCookie("Auth-Email"),
            //"auth-key": this.getCookie("Auth-Key"),
            keyDisplay: false,
            sampleKey: "",
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
        this.createZoneDropdown = this.createZoneDropdown.bind(this)
        this.createHintDropdown = this.createHintDropdown.bind(this)
        this.addHint = this.addHint.bind(this)
        this.updateHint = this.updateHint.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.highlightSelectOnChange = this.highlightSelectOnChange.bind(this)
        this.changeImage = this.changeImage.bind(this)

        this.updateSampleKey = this.updateSampleKey.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.setCookie = this.setCookie.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.toggleSimpleDisplay = this.toggleSimpleDisplay.bind(this)
    }

    componentDidMount() { }

    getCookie(name) {
        return document.cookie.split('; ').reduce((acc, v) => {
            const split = v.split('=')
            return split[0] === name ? decodeURIComponent(split[1]) : acc
        }, '')
    }

    setCookie(name, value, hours = 24 * 30 * 12) {
        const expires = new Date(Date.now() + hours * 36e5).toUTCString()
        let domainRegex = /(\w+)\.(\w+)$/
        let domain = domainRegex.test(location.hostname)
            ? `.${location.hostname.match(domainRegex)[0]}`
            : "localhost"
        document.cookie = name + '=' + value + '; sameSite=strict; expires=' + expires + `; domain=${domain};`
    }

    login() {
        this.setCookie("Auth-Email", this.state.sampleKey)
        api.get(`/username`, (res) => {
            if(res.status) {
                let email = this.getCookie("Auth-Email")
                this.setState({
                    "auth-email": email,
                    sampleKey: email
                })
            }
            else {
                //TODO: Inform of error
                console.log(res)
                this.setCookie("Auth-Email", '')
                this.setState({"auth-email": ''})
            }
        })
    }

    logout() {
        api.post(`/logout`, (res) => {
            if(res.status) {
                this.setCookie("Auth-Email", "")
                this.setState({
                    "auth-email": "",
                    sampleKey: "" 
                })
            }
            else {
                //TODO: Inform of error
                console.log(res)
            }
        })
    }

    createZoneDropdown(stateArr, options) {
        let optionsArr = options.map((optionItem, ind2) => {
            return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} className={"selectBox"}>
                <select className={"zone"} value={""} onChange={(e)=>this.addItem(e, stateArr)}>{optionsArr}</select>
            </div>
        )
        let list = this.state[stateArr].map((zone, i) => {
            return (
                <div key={i} className={"selectBox"}>
                    <select className={"zone"} value={zone} disabled>{optionsArr}</select>
                    <div>
                        <button className={"delete"} onClick={(e)=>this.removeItem(e, i, stateArr)}>X</button>
                    </div>
                </div>
            )
        })
        list.push(dropdown)
        return list;
    }

    createHintDropdown(stateArr, miscHints, miscItems) {
        let miscHintsOpts = miscHints.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let miscItemsOpts = miscItems.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} >
                <select value={this.state.hint[0]} onChange={(e)=>this.updateHint(e, 0)}>{miscHintsOpts}</select>
                <select value={this.state.hint[1]} onChange={(e)=>this.updateHint(e, 1)}>{miscItemsOpts}</select>
                <button onClick={(e)=>this.addHint(e, stateArr)}>Add</button>
            </div>
        )

        let list = this.state[stateArr].map((hint, i) => {
            return (
                <div key={i} style={{display: "flex"}}>
                    <select style={{background: "white"}} value={hint[0]} disabled>{miscHintsOpts}</select>
                    <select style={{background: "white"}} value={hint[1]} disabled>{miscItemsOpts}</select>
                    <div>
                        <button onClick={(e)=>this.removeItem(e, i, stateArr)}>X</button>
                    </div>
                </div>
            )
        })
        list.push(dropdown)
        return list;
    }

    updateHint(e, ind) {
        let val = e.target.value
        let currentHint = ind === 0 ? val : this.state.hint[0];
        let currentItem = ind === 1 ? val : this.state.hint[1];
        let updatedHint = [currentHint, currentItem]
        this.setState({hint: updatedHint})
    }

    addHint(e, stateArr) {
        let hint = this.state.hint
        let currentArr = this.state[stateArr].slice();
        currentArr.push(hint)
        this.setState({[stateArr]: currentArr, hint: ["", ""]})
    }

    addItem(e, stateArr) {
        let val = e.target.value
        let currentArr = this.state[stateArr].slice();
        currentArr.push(val)
        this.setState({[stateArr]: currentArr}, () => {
            this.highlightSelectOnChange()
        })
    }

    removeItem(e, i, stateArr) {
        let currentArr = this.state[stateArr].slice();
        currentArr.splice(i, 1)
        this.setState({[stateArr]: currentArr}, () => {
            this.highlightSelectOnChange()
        })
    }

    highlightSelectOnChange() {
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
        let s = this.state.useSimple ? "simple" : ""
        let styles = {
            songs: {row: `${s}songRow`, name: `${s}songLocation`, options: `${s}songName`},
            items: {row: `${s}itemRow`, name: `${s}itemName`, options: `${s}zone`},
            medals: {row: `${s}medalRow`, name: `${s}medalName`, options: `${s}medalZone`},
        }

        let rows = list.map((listItem, ind) => {
            let optionsArr = options.map((optionItem, ind2) => {
                return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
            })

            let selection = this.state.useSimple === true ? null : (
                <div className={"selectionContainer"}>
                    <select ref={colType === "items" && this.assignSelectRef.bind(this, ind)}
                    className={ styles[colType].options }
                    onChange={this.highlightSelectOnChange}>{optionsArr}
                    </select>
                </div>
            )

            this.state.useSimple == true ? null : multi_options.forEach((multi_option) => {
                if(multi_option.name === listItem) {
                    selection = [...Array(multi_option.num)].map((e, i) => {
                        return (
                            <div key={i} className={"selectionContainer"}>
                                <select ref={colType === "items" && i === 0 && this.assignSelectRef.bind(this, ind)}
                                className={ styles[colType].options }
                                onChange={this.highlightSelectOnChange}>{optionsArr}</select>
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

    updateSampleKey(e) {
        this.setState({sampleKey: e.target.value})
    }
    toggleSimpleDisplay() {
        let s = this.state.useSimple
        this.setState({useSimple: !s})
    }

    render() {

        let songRows = this.createColumn("songs", songNames, songLocations);
        let itemRows = this.createColumn("items", itemNames, zones, multi_options);
        let medalRows = this.createColumn("medals", medallions, medal_zones);

        let loginInput = this.state["auth-email"] ? null : <input type={this.state.keyDisplay ? "text" : "password"}
                        style={{position: "relative", left: "25px"}}
                        placeholder={`Email`} value={this.state.sampleKey} 
                        onChange={(e)=>this.updateSampleKey(e)}
                    />
        let keyDisplay = this.state["auth-email"] ? null : <span id={"togglePass"} 
                        className={this.state.keyDisplay ? "vis" : "vis-off"}
                        onClick={() => this.setState({keyDisplay: !this.state.keyDisplay}) }>
                    </span>
        let loginButton = this.state["auth-email"]
            ? <div>User: <b>{this.state["auth-email"]}</b> <button onClick={this.logout}>Logout</button></div> 
            : <button onClick={this.login}>Login</button>

        let simpleDisplayText = this.state.useSimple ? "Compact" : "Normal"

        return (
            <div id="component-home">
                <div>
                    {loginInput}
                    {keyDisplay}
                    {loginButton}
                    <div>Item Display: <b>{simpleDisplayText}</b> <button onClick={this.toggleSimpleDisplay}>Toggle</button></div>
                </div>
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
                        <h4>Way of the Hero</h4>
                        <div>
                            {this.createZoneDropdown("woth", zones)}
                        </div>
                    </div>
                    <div className={"zoneLists"}>
                        <h4>Barren</h4>
                        <div>
                            {this.createZoneDropdown("barren", zones)}
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Misc Hints</h3>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <div>
                            {this.createHintDropdown("hints", miscHints, miscItems)}
                        </div>
                        <textarea style={{margin: "0 10px"}} rows="5" cols="40"></textarea>
                    </div>
                </div>
            </div>
        );
    }

}

export { Home as default };
