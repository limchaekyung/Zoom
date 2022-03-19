import http from "http";
import express from "express";
// import WebSocket from "ws";
import SocketIo from "socket.io";
import { instrument } from "@socket.io/admin-ui";
const app = express();

app.set('view engine', "pug");  /* view engine: Pug */
app.set("views", __dirname + "/views"); /* views 디렉토리 설정 */
app.use("/public", express.static(__dirname + "/public"));
/* public 폴더를 유저에게 공개 */
/* public 파일: frontend에서 구동되는 JS코드(중요) */
/* server.js: Backend, app.js: FrontEnd */

app.get("/", (_, res) => res.render("home"));
/* /으로 이동시 사용될 템플릿(home.pug)을 렌더 */

app.get("/*", (_, res) => res.redirect("/"));
/* 어떤 url로 이동하던지 /으로 이동 */

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    }
});
instrument(wsServer, {
    auth: false,
})

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event: ${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1)
        );
    });
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

/* const wss = new WebSocket.Server({ server }); */
/* 같은 서버에서 http, websocket 작동(필수 사항 아님) */
/* express.js를 이용해서 http 서버 생성 */
/* http 서버 위에 WebSocket 생성 */

/* const sockets = [];

wss.on("connection", (socket) => {
    // socket: 연결된 브라우저 
    sockets.push(socket);
    socket["nickname"] = "Anon"; */    /* 익명 */
/* console.log("Connected to Browser ✔")  //브라우저 켜졌을 때
socket.on("close", () => { */              //브라우저 꺼졌을 때
// 익명함수: 이름이 없는 function
/* console.log("Disconnected from the Browser ❌")
})
socket.on("message", (msg) => { //브라우저가 서버에 메세지를 보낼 때 
const message = JSON.parse(msg); */
/* JSON.stringify: JavaScript object를 string으로 바꿔줌 */
/* switch(message.type){
    case "new_message":
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
    case "nickname":
        console.log(message.payload)
        socket["nickname"] = message.payload;
}
})
}) */

httpServer.listen(3000, handleListen);