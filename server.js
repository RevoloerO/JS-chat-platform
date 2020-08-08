const path = require('path')
const http = require('http')
const express = require('express')
const socket = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave,getRoomUsers} = require('./utils/user')


const app = express()
const server = http.Server(app)
const io = socket(server)

app.use(express.static(path.join(__dirname,'public')))

const botName = 'Chatty Bot'
//run client side
io.on('connection', socket =>{
  socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)
    //console.log('New User Connection..')
    socket.emit('message', formatMessage(botName,'Chatty Time'))
    //broadcast when connect
    socket.broadcast
    .to(user.room)
    .emit(
      'message',
      formatMessage(botName,`${user.username} has joined`)
    )
    //send users and room info
    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    })
  })
  //listen for chatMessage
  socket.on('chatMessage', msg=>{
    const user = getCurrentUser(socket.id)
    //console.log(msg)
    io.to(user.room).emit('message',formatMessage(user.username ,msg))
  })
  //when user disconnect
  socket.on('disconnect',()=>{
    const user = userLeave(socket.id)
    if(user){
      io.to(user.room)
      .emit('message',formatMessage(botName,`${user.username} has left`))
      io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
      })
    }

  })
})
const PORT = (process.env.PORT || 5000)

server.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})
