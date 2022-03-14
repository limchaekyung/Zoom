import WebSocket from "ws";
const socket = new WebSocket(`ws://${window.location.host}`);
// socket: 서버와 연결

socket.addEventListener("open", () => {
    // 서버 연결
    console.log("Connected to server ✔")
})

socket.addEventListener("message", (message) => {
    //서버에 메시지를 보낼 때
    console.log("New message: ", message.data, " from the Server")
})

socket.addEventListener("close", () => {
    // 서버가 오프라인이 되었을 떄
    console.log("Disconnected from server ❌")
})

setTimeout(() => {
    socket.send("hello from the browser!")
}, 10000)