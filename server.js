const express =  require('express')
const http = require('http')
const socketIo = require('socket.io')

const app =  express()
const server = http.createServer(app)
const io = socketIo(server, {
    cors: {
      origin: "*",  // Allow requests from React app
      methods: ["GET", "POST"],        // Allow specific HTTP methods
      allowedHeaders: ["Content-Type"],  // Optional, allows specific headers
    }
  });

  let users = [];

//serve static files
app.use(express.static('public'))



io.on('connection',(socket)=>{
    console.log('a user connected')

    socket.on('join', (userName) => {
        // Store the user's name
        users[socket.id] = userName;
        console.log(`${userName} has joined the chat`);
    
        // Send a welcome message to the new user
        socket.emit('chat message', { name: 'System', text: `Welcome, ${userName}!` });
      });


    socket.on('chat message',(msg)=>{
        io.emit('chat message',msg)
    })

    socket.on('disconnect',()=>{
        console.log('user disconnected')
        if (users[socket.id]) {
            const userName = users[socket.id];
            io.emit('chat message', { name: 'System', text: `${userName} has left the chat.` });
            delete users[socket.id];  // Clean up the users list
          }
    })
})

server.listen(8080,'0.0.0.0',()=>{
    console.log('server running at http://localhost:8080')
})