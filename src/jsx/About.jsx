"use strict";

import React from 'react';
import DOM from 'react-dom';
import { api } from "os-npm-util";

// require("../style/About.less")

class About extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

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


    render() {

        return (
            <div>
                <h3>About</h3>
                Congratulations! This is the example "About.jsx" page at "/about".
            </div>
        );
    }

}

module.exports = About
