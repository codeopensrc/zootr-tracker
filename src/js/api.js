"use strict";

const getCookie = (name) => {
    return document.cookie.split('; ').reduce((acc, v) => {
        const split = v.split('=')
        return split[0] === name ? decodeURIComponent(split[1]) : acc
    }, '')
}

function defaultMessage(path, err) {
    alert("Unfortunately your request could not be processed. If this issue happens"+
    " again, please contact your administrator providing the following info: \n\n"+`${path} \n ${err}` )
}

const api = {

    get: function (path, opts, callback) {
        if(typeof(opts) === "function") { callback = opts; opts = {} }
        if(path.charAt(0) !== "/") { path = `/${path}`; }

        let returnAs = opts.returnAs || "json"

        let request = {
            method: "GET",
            headers: {
                "Auth-Email": getCookie("Auth-Email"),
                "Auth-Key": getCookie("Auth-Key"),
            }
        }
        fetch(`${HOST}/api/get`+path, request)
        .then((r) => {
            if(returnAs === "string") { return r.text() }
            if(returnAs === "json") { return r.json() }
            return r.json()
        })
        .then(callback)
        .catch((err) => { defaultMessage(path, err) })
    },

    post: function (path, opts, callback) {
        if(typeof(opts) === "function") { callback = opts; opts = {} }
        if(path.charAt(0) !== "/") { path = `/${path}`; }

        opts.path = path
        let request = {
            method: "POST",
            body: JSON.stringify(opts),
            headers: {
                "Auth-Email": getCookie("Auth-Email"),
                "Auth-Key": getCookie("Auth-Key"),
            }
        }
        fetch(`${HOST}/api/post`+path, request)
        .then((r) => r.json())
        .then(callback)
        .catch((err) => { defaultMessage(path, err) })
    },

    put: function (path, opts, callback) {
        if(typeof(opts) === "function") { callback = opts; opts = {} }
        if(path.charAt(0) !== "/") { path = `/${path}`; }

        opts.path = path
        let request = {
            method: "PUT",
            body: JSON.stringify(opts),
            headers: {
                "Auth-Email": getCookie("Auth-Email"),
                "Auth-Key": getCookie("Auth-Key"),
            }
        }
        fetch(`${HOST}/api/put`+path, request)
        .then((r) => r.json())
        .then(callback)
        .catch((err) => { defaultMessage(path, err) })
    },

}

module.exports = api
