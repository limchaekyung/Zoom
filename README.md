# Noom

Zoom Clone using NodeJS, WebRTC and Websockets.

### 사전 지식  
Backend: ExpressJS, app.get(), Pug, (req, res)  
package.json, Babel, nodemon  
frontend: document.querySelector, document.createElement  
title.innerText = "", .classList.add()

### http 프로토콜
request -> response 과정
stateless(response 이후 서버가 유저를 기억하지 못함)
cookie 생성
real-time으로 작동X

### WebSocket
real-time 작동 프로토콜
WebSocket request -> WebSocket accept 
-> connect(실시간 양방향 연결, 서버는 어떤 때나 유저에게 메시지를 보낼 수 있고, 유저도 서버에게 메시지를 보낼 수 있음) 
-> WebSocket closed
브라우저와 서버 사이에서만 발생X
브라우저 - backend, backend - backend 사이에서도 가능

### ws
Node.js의 기초적인 WebSocket 라이브러리