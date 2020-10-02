const express = require("express");

const app = express();
const http = require("http").Server(app);
const io  = require("socket.io")(http, {
    transports: ["websocket"],
    allowUpgrades: false,
    pingTimeout: 30000,
    pingInterval: 5000,
    autoConnect: true
});

const port = process.env.PORT || 4001;
const index = require("./routes/index");

app.use(index);

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    })
})

const getApiAndEmit = (socket) => {
    const response = new Date();
    socket.emit("updatedTime", response);
};

http.listen(port, () => console.log(`Listening on port ${port}`));



