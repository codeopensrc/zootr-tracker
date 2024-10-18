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
const miscHints = ["", "LW: Skull Mask", "Market: Chest", "Kak: Cuccos", "GY: Sun", "GY: Flame", "DMT: Biggoron", "GC: Hammer",
    "GC: Dance", "GC: Pottery", "ZR: Final Frog", "ZF: Under Ice", "ZD: Unfreeze", "L Hylia: Sun", "GV: Hammer", "FT: Pierre",
    "FT: Top Flare", "WT: Boulder", "WT: River", "Spirit: ColoLH", "Spirit: ColoRH", "Shadow: Invis Maze", "GTG: Sunken", "GTG: Final Thieves", "BotW: DeadHand"]
const miscItems = ["", "Dead", "SM Key", "Boss Key", "D Defense", "Wind", ...itemNames]

let items = itemNames.map((itemName) => ({name: itemName, clicks: 0, locations: []}) )
let medals = medallions.map((medalName) => ({name: medalName, clicks: 0, locations: []}) )
let songs = songNames.map((songName) => ({name: songName, clicks: 0, locations: []}) )

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            useSimple: false,
            keyDisplay: false,
            songs: songs,
            items: items,
            medals: medals,
            woth: [],
            barren: [],
            hints: [],
            hint: ["", ""],
            authEmail: this.getCookie("Auth-Email"),
            authKey: this.getCookie("Auth-Key"),
            inputEmail: "",
            inputKey: "",
            secretKey: this.getCookie("Auth-Key"), // TODO: Doing this for now
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
        this.saveImgClick = this.saveImgClick.bind(this)
        this.saveDropdownClick = this.saveDropdownClick.bind(this)
        this.saveHintClick = this.saveHintClick.bind(this)
        this.sendSaveState = this.sendSaveState.bind(this)
        this.getSaveState = this.getSaveState.bind(this)
        this.setSaveState = this.setSaveState.bind(this)
        this.updateInput = this.updateInput.bind(this)
        this.getCookie = this.getCookie.bind(this)
        this.setCookie = this.setCookie.bind(this)
        this.login = this.login.bind(this)
        this.logout = this.logout.bind(this)
        this.toggleSimpleDisplay = this.toggleSimpleDisplay.bind(this)
        this.saveZoneSelectOnChange = this.saveZoneSelectOnChange.bind(this)
    }

    componentDidMount() {
        this.getSaveState()
    }

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
        this.setCookie("Auth-Email", this.state.inputEmail)
        this.setCookie("Auth-Key", this.state.inputKey)
        api.get(`/username`, (res) => {
            if(res.status) {
                let email = this.getCookie("Auth-Email")
                let key = this.getCookie("Auth-Key")
                this.setState({
                    authEmail: email,
                    authKey: key,
                    inputEmail: "",
                    inputKey: "",
                    secretKey: key,
                }, this.getSaveState)
            }
            else {
                //TODO: Inform of error
                console.log(res)
                this.setCookie("Auth-Email", "")
                this.setCookie("Auth-Key", "")
                this.setState({authEmail: "", authKey: "", secretKey: ""})
            }
        })
    }

    logout() {
        api.post(`/logout`, (res) => {
            if(res.status) {
                this.setCookie("Auth-Email", "")
                this.setCookie("Auth-Key", "")
                this.setState({
                    authEmail: "",
                    authKey: "",
                    secretKey: "",
                    songs: songs,
                    items: items,
                    medals: medals,
                    woth: [],
                    barren: [],
                    hints: [],
                    hint: ["", ""],
                })
            }
            else {
                //TODO: Inform of error
                console.log(res)
            }
        })
    }

    saveImgClick(imageArrName, imageName, imageOpacity) {
        let uniqueImageName = imageName.replace(/\d/, "")
        let newList = this.state[imageArrName].map(({name, clicks, locations}) => {
            name == uniqueImageName && (clicks = imageOpacity > 0.7 ? clicks+1 : 0)
            return {name, clicks, locations}
        })
        let json = {
            secretKey: this.state.secretKey,
            doc: {
                id: this.state.id ? this.state.id : "",
                user: this.state.authEmail,
                [imageArrName]: newList
            }
        }
        this.setState({ [imageArrName]: newList }, ()=>this.sendSaveState(json))
    }

    saveDropdownClick(stateArrName, dropdownName, location, ind) {
        let newList = this.state[stateArrName].map(({name, clicks, locations}) => {
            name == dropdownName && (locations[ind] = location)
            return {name, clicks, locations}
        })
        let json = {
            secretKey: this.state.secretKey,
            doc: {
                id: this.state.id ? this.state.id : "",
                user: this.state.authEmail,
                [stateArrName]: newList
            }
        }
        this.setState({ [stateArrName]: newList }, ()=>this.sendSaveState(json))
    }

    saveHintClick(stateArrName, newList) {
        let json = {
            secretKey: this.state.secretKey,
            doc: {
                id: this.state.id ? this.state.id : "",
                user: this.state.authEmail,
                [stateArrName]: newList
            }
        }
        let newHintState = stateArrName !== "hints" ? this.state.hint : ["", ""]
        this.setState({ [stateArrName]: newList, hint: newHintState }, ()=>this.sendSaveState(json))
    }

    sendSaveState(json) {
        if(!this.state.authEmail) {
            // TODO: Banner inform user progress lost on page refresh unless logged in
            return console.log("ERR: Cannot sendSaveState, not logged in")
        }
        api.put(`/savestate`, json, (res) => {
            if(res.status && res.data) {
                console.log("Success")
                this.getSaveState(res.data)
            }
            else {
                console.log("Oops")
                console.log(res)
            }
        })
    }

    getSaveState(doc = {}) {
        if(Object.keys(doc).length !== 0) {
            return this.setSaveState(doc)
        }
        api.get(`/savestate`, (res) => {
            if(res.status && res.data) {
                this.setSaveState(res.data)
            }
            //TODO: Feel like we should do something if not found idk
        })
    }

    setSaveState(doc) {
        let newStateObj = {}
        Object.hasOwn(doc, '_id') && (newStateObj.id = doc._id)
        Object.hasOwn(doc, 'user') && (newStateObj.user = doc.user)
        Object.hasOwn(doc, 'useSimple') && (newStateObj.useSimple = doc.useSimple)
        Object.hasOwn(doc, 'songs') && (newStateObj.songs = doc.songs)
        Object.hasOwn(doc, 'items') && (newStateObj.items = doc.items)
        Object.hasOwn(doc, 'medals') && (newStateObj.medals = doc.medals)
        Object.hasOwn(doc, 'woth') && (newStateObj.woth = doc.woth)
        Object.hasOwn(doc, 'barren') && (newStateObj.barren = doc.barren)
        Object.hasOwn(doc, 'hints') && (newStateObj.hints = doc.hints)
        this.setState(newStateObj, this.highlightSelectOnChange)
    }

    createZoneDropdown(hintArrName, options) {
        let optionsArr = options.map((optionItem, ind2) => {
            return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} className={"selectBox"}>
                <select className={"zone"} value={""} onChange={(e)=>this.addItem(e, hintArrName)}>{optionsArr}</select>
            </div>
        )
        let list = this.state[hintArrName].map((zone, i) => {
            return (
                <div key={i} className={"selectBox"}>
                    <select className={"zone"} value={zone} disabled>{optionsArr}</select>
                    <div>
                        <button className={"delete"} onClick={(e)=>this.removeItem(e, i, hintArrName)}>X</button>
                    </div>
                </div>
            )
        })
        list.push(dropdown)
        return list;
    }

    createHintDropdown(hintArrName, miscHints, miscItems) {
        let miscHintsOpts = miscHints.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let miscItemsOpts = miscItems.map((optionItem, ind) => {
            return ( <option key={ind} value={optionItem}>{optionItem}</option> );
        })
        let dropdown = (
            <div key={"dropdown"} style={{display: "flex"}}>
                <select value={this.state.hint[0]} onChange={(e)=>this.updateHint(e, 0)}>{miscHintsOpts}</select>
                <select value={this.state.hint[1]} onChange={(e)=>this.updateHint(e, 1)}>{miscItemsOpts}</select>
                <button onClick={()=>this.addHint(hintArrName)}>Add</button>
            </div>
        )

        let list = this.state[hintArrName].map((hint, i) => {
            return (
                <div key={i} style={{display: "flex"}}>
                    <select style={{background: "white"}} value={hint[0]} disabled>{miscHintsOpts}</select>
                    <select style={{background: "white"}} value={hint[1]} disabled>{miscItemsOpts}</select>
                    <div>
                        <button onClick={(e)=>this.removeItem(e, i, hintArrName)}>X</button>
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

    addHint(hintArrName) {
        let hint = this.state.hint
        let newArr = this.state[hintArrName].slice();
        newArr.push(hint)
        this.saveHintClick(hintArrName, newArr)
    }

    addItem(e, hintArrName) {
        let val = e.target.value
        let newArr = this.state[hintArrName].slice();
        newArr.push(val)
        this.saveHintClick(hintArrName, newArr)
    }

    removeItem(e, ind, hintArrName) {
        let newArr = this.state[hintArrName].slice();
        newArr.splice(ind, 1)
        this.saveHintClick(hintArrName, newArr)
    }

    saveZoneSelectOnChange(stateArrName, objName, e, ind) {
        let location = e.target.value
        this.saveDropdownClick(stateArrName, objName, location, ind)
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

    changeImage(e, colType) {
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
        this.saveImgClick(colType, e.target.title, e.target.style.opacity)
    }

    createColumn(colType, list, options, multi_options = []) {
        let sc = this.state.useSimple ? "simple" : ""
        let classNames = {
            songs: {row: `songRow ${sc}`, name: `songLocation ${sc}`, options: `songName ${sc}`},
            items: {row: `itemRow ${sc}`, name: `itemName ${sc}`, options: `zone ${sc}`},
            medals: {row: `medalRow ${sc}`, name: `medalName ${sc}`, options: `medalZone ${sc}`},
        }

        let rows = list.map(({name, clicks, locations}, ind) => {
            let optionsArr = options.map((optionItem, ind2) => {
                return ( <option key={ind2} value={optionItem}>{optionItem}</option> );
            })

            let selection = this.state.useSimple === true ? null : (
                <div className={"selectionContainer"}>
                    <select ref={colType === "items" && this.assignSelectRef.bind(this, ind)}
                    className={ classNames[colType].options }
                    value={locations[0] || ""}
                    onChange={(e)=>this.saveZoneSelectOnChange(colType, name, e, 0)}>
                        {optionsArr}
                    </select>
                </div>
            )

            this.state.useSimple == true ? null : multi_options.forEach((multi_option) => {
                if(multi_option.name === name) {
                    selection = [...Array(multi_option.num)].map((e, i) => {
                        return (
                            <div key={i} className={"selectionContainer"}>
                                <select ref={colType === "items" && i === 0 && this.assignSelectRef.bind(this, ind)}
                                className={ classNames[colType].options }
                                value={locations[i] || ""}
                                onChange={(e)=>this.saveZoneSelectOnChange(colType, name, e, i)}>
                                    {optionsArr}
                                </select>
                            </div>)
                    })
                }
            })
            let title = `${name}${clicks > 1 ? clicks : ""}`
            let opacity = `${clicks > 0 ? 100 : 40}%`

            return (
                <div className={ `${classNames[colType].row}` } key={ind} ref={colType == "items" && this.assignDivRef.bind(this, ind)}>
                    <span className={ classNames[colType].name }>
                        <img style={{opacity: opacity}} title={title}
                        onClick={(e)=>this.changeImage(e, colType)}
                        src={`data:image/png;base64,${sprites[title+".txt"]}`} />
                    </span>
                    {selection}
                </div>
            );
        })
        return rows;
    }

    updateInput(e, inputName) {
        this.setState({[inputName]: e.target.value})
    }

    toggleSimpleDisplay() {
        let s = this.state.useSimple
        this.setState({useSimple: !s}, () => {
            this.highlightSelectOnChange()
            let json = {
                secretKey: this.state.secretKey,
                doc: { id: this.state.id ? this.state.id : "", useSimple: this.state.useSimple}
            }
            api.put(`/savestate`, json, (res) => {
                if(res.status && res.data) {
                    console.log("Success")
                }
                else {
                    console.log("Oops")
                    console.log(res)
                }
            })
        })
    }

    render() {
        let songRows = this.createColumn("songs", this.state.songs, songLocations);
        let itemRows = this.createColumn("items", this.state.items, zones, multi_options);
        let medalRows = this.createColumn("medals", this.state.medals, medal_zones);

        let loginEmailInput = this.state.authEmail ? null : <input type={"text"}
                        style={{position: "relative", left: "-12px"}}
                        placeholder={`Email`} value={this.state.inputEmail} 
                        onChange={(e)=>this.updateInput(e, "inputEmail")}
                    />
        let loginKeyInput = this.state.authEmail ? null : <input type={this.state.keyDisplay ? "text" : "password"}
                        style={{position: "relative", left: "25px"}}
                        placeholder={`Key`} value={this.state.inputKey} 
                        onChange={(e)=>this.updateInput(e, "inputKey")}
                    />
        let authKeyDisplay = this.state.authEmail ? null : <span id={"togglePass"} 
                        className={this.state.keyDisplay ? "vis" : "vis-off"}
                        onClick={() => this.setState({keyDisplay: !this.state.keyDisplay}) }>
                    </span>
        let loginButton = this.state.authEmail
            ? <div>User: <b>{this.state.authEmail}</b> <button onClick={this.logout}>Logout</button></div> 
            : <button onClick={this.login}>Login</button>

        let simpleDisplayText = this.state.useSimple ? "Compact" : "Normal"
        let sc = this.state.useSimple ? " simple" : ""

        return (
            <div id="component-home">
                <div>
                    {loginEmailInput}
                    <br />
                    {loginKeyInput}
                    {authKeyDisplay}
                    {loginButton}
                    <div>
                        Item Display: <b>{simpleDisplayText} </b> 
                        <button onClick={this.toggleSimpleDisplay}>Toggle</button>
                    </div>
                </div>
                <div style={{display: "flex", height: "30em"}}>
                    <div>
                        <h3>Songs</h3>
                        <div id="songs" className={"col"}>
                            {songRows}
                        </div>
                    </div>
                    <div>
                        <h3>Items</h3>
                        <div id="items" className={`col ${sc}`}>
                            {itemRows}
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex"}}>
                            <div className={"zoneLists"}>
                                <h3>Way of the Hero</h3>
                                <div>
                                    {this.createZoneDropdown("woth", zones)}
                                </div>
                            </div>
                            <div className={"zoneLists"}>
                                <h3>Barren</h3>
                                <div>
                                    {this.createZoneDropdown("barren", zones)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4>Misc Hints</h4>
                            {this.createHintDropdown("hints", miscHints, miscItems)}
                            <div style={{display: "flex"}}>
                                <textarea style={{margin: "10px 0"}} rows="5" cols="35"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="medals" className={sc}>
                    {medalRows}
                </div>
            </div>
        );
    }

}

export { Home as default };
