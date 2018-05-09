"use strict";

import React from 'react';
import DOM from 'react-dom';
import { api } from "os-npm-util";

// require("../style/Home.less")

class Home extends React.Component {

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
                HI
            </div>
        );
    }

}

module.exports = Home
