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

const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer);

wsServer.on("connection", socket => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName)
        socket.to(roomName).emit("welcome")
    })
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer)
    })
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer)
    })
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice)
    })
})
const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);