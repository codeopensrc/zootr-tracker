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
import { Menu } from "os-npm-util";

require("../style/Entry.less")

class Entry extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }


    render() {

        return (
            <Router>
                <div id={"component-entry"}>
                    <Menu />
                    <div id={"component-header"}>
                        <Link to={"/home"} className={"headerButton"}>Home</Link>
                    </div>

                    <Route path={"/home"} component={Home} />
                </div>
            </Router>
        );
    }

}

DOM.render(<Entry />, document.getElementById("main"))
