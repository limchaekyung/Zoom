import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set('view engine', "pug");  /* view engine: Pug */
app.set("views", __dirname + "/views"); /* views 디렉토리 설정 */
app.use("/public", express.static(__dirname + "/public"));  
/* public 폴더를 유저에게 공개 */
/* public 파일: frontend에서 구동되는 JS코드(중요) */
/* server.js: Backend, app.js: FrontEnd */

app.get("/", (req, res) => res.render("home"));
/* /으로 이동시 사용될 템플릿(home.pug)을 렌더 */

app.get("/*", (req, res) => res.redirect("/"));
/* 어떤 url로 이동하던지 /으로 이동 */

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
/* 같은 서버에서 http, websocket 작동(필수 사항 아님) */
/* express.js를 이용해서 http 서버 생성 */
/* http 서버 위에 WebSocket 생성 */

server.listen(3000, handleListen);