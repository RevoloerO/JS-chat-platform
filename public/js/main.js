const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//getusernam and room from URL
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
})

const socket = io()

//Join room
socket.emit('joinRoom',{username, room})

//get room info
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room)
  outputUsers(users)
})
//get message from server
socket.on('message',message =>{
  console.log(message)
  outputMessage(message)

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//submit messages
chatForm.addEventListener('submit', e =>{
  e.preventDefault()

  const msg = e.target.elements.msg.value;

  //emit msginto server
  socket.emit('chatMessage',msg)

  //clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

function outputMessage(message){
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

//Addroom name to DOM
function outputRoomName(room){
  roomName.innerText = room
}
//Add user list to DOM
function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}
