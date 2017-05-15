"use strict";

import React from 'react';
import DOM from 'react-dom';

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
            <div>
                HI
            </div>
        );
    }

}

DOM.render(<Entry />, document.getElementById("main"))
