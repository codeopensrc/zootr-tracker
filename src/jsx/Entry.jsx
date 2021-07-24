"use strict";

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

require("../style/Entry.less")

class Entry extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        //When component successfully loads
    }

    render() {

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
                        <Route path={"/"} component={Home} />
                    </Switch>
                </div>
            </Router>
        );
    }

}

DOM.render(<Entry />, document.getElementById("main"))
