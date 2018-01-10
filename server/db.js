"use strict";

const url = require("url");
const consul = require('consul')({host:"172.17.0.1"});

const auth = require("./auth.js");

// Connect to DB
const USE_DEV_DB_URL = JSON.parse(process.env.USE_DEV_DB_URL);
const DEV_DB_URL = process.env.DEV_DATABASE_URL ? url.parse(process.env.DEV_DATABASE_URL) : "";

// Mongo
// const mongo = require('mongodb').MongoClient
// const ObjectID = require("mongodb").ObjectID;
const DEFAULT_MONGO_DB_NAME = "mymongo"
const DEFAULT_MONGO_DB_URL = `mongodb://172.17.0.1:27017/${DEFAULT_MONGO_DB_NAME}`

// PG
//
//
//



module.exports = {

    db: null,

    mongoinit: function () {
        let connectionString = USE_DEV_DB_URL
            ? DEV_DB_URL
            : DEFAULT_MONGO_DB_URL

        if(!USE_DEV_DB_URL) {
            consul.catalog.service.nodes("mongo", (err, res) => {
                if (err) { console.log("ERR - db.js", err); }
                let host = res && res[0] ? res[0].Address : ""
                connectionString = connectionString.replace("172.17.0.1", host)
                if(!host) { return console.error("No Host found for DB.js"); }
                // mongo.connect(connectionString, (err, db) => this.db = db)
            })
        }
        else {
            // mongo.connect(connectionString, (err, db) => this.db = db)
        }
    },

    resWithErr: function(err, db, res) {
        console.error(err);
        res.writeHead(200, {'Access-Control-Allow-Origin' : '*'} );
        res.end(JSON.stringify({status: "Error"}));
    },

    resWithNoAccess: function (res) {
        res.writeHead(200, {'Access-Control-Allow-Origin' : '*'} );
        res.end(JSON.stringify({authorized: false}));
    },

    checkAccess: function (headers, accessReq, callback) {
        auth.checkAccess({headers, accessReq: accessReq})
        .then(({ status, hasPermissions }) => {
            if(!status) {
                console.log("User has incorrect authentication credentials");
                return callback({status: false})
            }
            if(!hasPermissions) {
                console.log("User does not have required access for action");
                return callback({status: false})
            }
            callback({status: true})
        })
        .catch((e) => { console.log("Bad:", e); callback({status: false}) })
    },

}
