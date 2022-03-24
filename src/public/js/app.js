const socket = io();

const welcome = document.getElementById("welcome");
const enter = welcome.querySelector("#enter");
const room = document.getElementById("room");
const nameForm = welcome.querySelector("#name");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

nameForm.addEventListener("submit", handleNicknameSubmit);

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector("#name input");
    socket.emit("nickname", input.value);
    const h4 = welcome.querySelector("#name h4");
    h4.innerText = `nickname: ${input.value}`;
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

    const msgForm = room.querySelector("#msg");

    msgForm.addEventListener("submit", handleMessageSubmit);

}


function handleRoomSubmit(event) {
    event.preventDefault();

    const input = enter.querySelector("#enter input");
    socket.emit("enter_room", input.value, showRoom);

    roomName = input.value;
    input.value = "";
}

enter.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${user} joined`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3")
    h3.innerText = `Room ${roomName} (${newCount})`
    addMessage(`${left} left`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul")
    roomList.innerHTML = "";
    if (rooms.length === 0) {
        return;
    }
    rooms.forEach(room => {
        const li = document.createElement("li")
        li.innerText = `${room}`;
        roomList.append(li)
    })
})