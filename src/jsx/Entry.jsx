"use strict";

import { hot } from 'react-hot-loader/root';
import React from 'react';
import DOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link
} from 'react-router-dom';

import Home from "./Home.jsx"
//import About from "./About.jsx"
//import { Menu } from "os-npm-util";
//import { ErrorHandler } from "os-npm-util";

import "../style/Entry.less"

const Entry = function() {
    //<Menu />
    //<ErrorHandler />
    // <div id={"component-header"}>
    //    <Link to={"/"} className={"headerButton"}>Home</Link>
    //    <Link to={"/about"} className={"headerButton"}>About</Link>
    //</div>
    //<Route path={"/about"} component={About} />

    return (
        <Router>
            <div id={"component-entry"}>
                <Switch>
                    <Route exact path={"/"} component={Home} />
                </Switch>
            </div>
        </Router>
    );
}

export default hot(Entry);

DOM.render(<Entry />, document.getElementById("main"))
