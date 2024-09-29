"use strict";

const os = require("os");
const consul = require("./consul.js");

const REGISTER_CHECK = process.env.REGISTER_CHECK == "true"
const LOG_EVERY_NUM_CHECKS = process.env.LOG_EVERY_NUM_CHECKS || 30;
let serverCheckCount = 0;

module.exports = {

    httpServer: null,
    httpsServer: null,
    wsServer: null,
    redisServer: null,
    mongoServer: null,
    pgServer: null,
    proxyServer: null,

    connectionsToCheck: {},
    connectionsToClose: {},

    closing: false,
    deregistering: false,

    registerConnection: function (serverType) {
        this.connectionsToCheck[serverType] = "unhealthy";
        this.connectionsToClose[serverType] = "";
    },

    get allConnectionsHealthy() {
        return Object.keys(this.connectionsToCheck).every((serverType) =>
            this.connectionsToCheck[serverType] === "healthy"
        )
    },

    get allConnectionsUnhealthy() {
        return Object.keys(this.connectionsToCheck).every((serverType) =>
            this.connectionsToCheck[serverType] === "unhealthy"
        )
    },

    get allConnectionsClosed() {
        return Object.keys(this.connectionsToClose).every((serverType) =>
            this.connectionsToClose[serverType] === "disconnected"
        )
    },

    changeServerState: function (type, isOnline) {
        this.connectionsToCheck[type] = isOnline?"healthy":"unhealthy"
        console.log(`${type} is now: `, isOnline?"Online":"Offline");
        this.allConnectionsUnhealthy && this.closeConnections()
    },

    startIfAllReady: function () {
        this.allConnectionsHealthy && process.send('ready')
    },

    handleHealthCheck: function(res) {
        let systems_online = this.allConnectionsHealthy
        if(LOG_EVERY_NUM_CHECKS > 0 && ++serverCheckCount % LOG_EVERY_NUM_CHECKS === 0) {
            console.log(`Container ${os.hostname}: ${systems_online?"Online":"Malfunctioning"}`);
        }
        let httpStatusCode = systems_online ? 200 : 404
        res.writeHead(httpStatusCode)

        let exitCode = systems_online ? "0" : "1"
        res.end(exitCode)

        let checkPassOrFail = systems_online ? "pass" : "fail"

        REGISTER_CHECK && consul.sendHealthCheck(checkPassOrFail)
    },

    registerSigHandler: function (server, type, deregister) {
        let close = (SIG) => {
            console.log(`${type} received ${SIG} signal, shutting down`);
            deregister && (this.deregistering = true);
            deregister && consul.deregisterCheck((err, res) => {
                this.deregistering = false
                this.tryToExit();
            });
            this.changeServerState(type, false)
        }

        // this[type+"Server"] = server
        // We're doing it this way since it looks less confusing tbh
        type === "http" && (this.httpServer = server)
        type === "https" && (this.httpsServer = server)
        type === "ws" && (this.wsServer = server)
        type === "redis" && (this.redisServer = server)
        type === "mongo" && (this.mongoServer = server)
        type === "proxy" && (this.proxyServer = server)
        type === "pg" && (this.pgServer = server)

        process.on("SIGTERM", close)
        process.on("SIGHUP", close)
        process.on("SIGINT", close)
        process.on("SIGQUIT", close)
        process.on("SIGABRT", close)
    },

    tryToExit: function () {
        if(this.allConnectionsClosed && !this.deregistering) {
            console.log("== Exiting now ==")
            process.exit()
        }
    },

    closeConnections: function () {
        if(this.closing) { return; }
        this.closing = true;
        let connectionCloseCallback = (type) => {
            console.log(`Closed out ${type} successfully`);
            this.connectionsToClose[type] = "disconnected"
            this.tryToExit()
        }

        // Each server can have a unique "close" method, eventually we can overload/polyfill
        //  the unique over the general
        this.httpServer && this.httpServer.close(() => { connectionCloseCallback("http") })
        this.httpsServer && this.httpsServer.close(() => { connectionCloseCallback("https") })
        this.wsServer && this.wsServer.close(() => { connectionCloseCallback("ws") })
        this.redisServer && this.redisServer.quit(() => { connectionCloseCallback("redis") })
        this.mongoServer && this.mongoServer.close(() => { connectionCloseCallback("mongo") })
        this.proxyServer && this.proxyServer.close(() => { connectionCloseCallback("proxy") })
        this.pgServer && this.pgServer.end(() => { connectionCloseCallback("pg") })

    },

}
