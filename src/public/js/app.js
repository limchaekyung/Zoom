const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);
// socket: 서버와 연결

function makeMessage(type, payload){
    const msg = {type, payload}
    return JSON.stringify(msg);
}
socket.addEventListener("open", () => {
    // 서버 연결
    console.log("Connected to server ✔")
})

socket.addEventListener("message", (message) => {
    //서버에 메시지를 보낼 때
    const li = document.createElement("li")
    li.innerText = message.data;
    messageList.append(li);
})

socket.addEventListener("close", () => {
    // 서버가 오프라인이 되었을 떄
    console.log("Disconnected from server ❌")
})

/* setTimeout(() => {
    socket.send("hello from the browser!")
}, 10000) */

function handleSubmit(event){
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value));
    input.value = '';
    input.value = '';
}

function handleNickSubmit(event){
    event.preventDefault();
    const input = nickForm.querySelector('input')
    socket.send(makeMessage("nickname", input.value))
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
