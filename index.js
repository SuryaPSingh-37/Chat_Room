const express = require('express');
// const { format } = require('path');
const path = require('path');
const app = express();
const io = require('socket.io')(app.listen(3000));  //initializing io instance by passing the server

//importing format message function from utils folder
const formatMessage = require('./utils/messageFormat');

//importing adduser, finduser etc from users utils
const { addUser, getCurrentUser, removeUser, getRoomUsers } = require('./utils/users');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'/views'));

app.use(express.static(path.join(__dirname,'Public')));


app.get('/',(req, res)=>{
    res.render('index');
});
app.get('/chat', (req,res)=>{
    // console.log(req.query);
    // const user = req.query.user;
    // const room = req.query.room;
    res.render('chat');
});

// //Old version where  room functionality was not added
// // This will look for new connection but will evoke only to those pages where we have a corresponding client side socket object
// io.on('connection', (socket)=>{
//     // console.log("New user connected!");

//     //Sending welcome message to newly connected user
//         //socket.emit means only the current user i.e., the new connected user will see the message
//     socket.emit('message', formatMessage('ChatBot', 'Welcome to the chat-room'));

//     //send message to everyone except the current user
//         //socket.broadcast.emit()
//     socket.broadcast.emit('message', formatMessage('ChatBot', 'A user has joined the chat'));

    
//     //send to everyone -> io.emit
//         //message of disconnection
//     socket.on('disconnect',()=>{
//         io.emit('message', formatMessage('ChatBot', 'A user has left the chat'));
//     });

//     //listening for message
//     socket.on('chatMessage',(msg)=>{
//         //display on server
//             // console.log(msg);
        
//         //emit to everyone
//         io.emit('message', formatMessage('John', msg));
//     })


// })


// New version where we have added room funtionality
io.on('connection', (socket)=>{
    socket.on('joinRoom',({user, room })=>{
        //add this user to Users array
        const User = addUser(socket.id, user, room);
        //Join room
        socket.join(User.room);

         //Emit message to newly connected user 
        socket.emit('message', formatMessage('ChatBot', 'Welcome to the chatroom!'));

        //Brodcast to other users of same room about new user connection
        socket.broadcast.to(User.room).emit('message',formatMessage('ChatBot',`${User.username} has joined the Chat`));

        //return room and users information
        io.to(User.room).emit('roomUser', {
            room: User.room,
            users: getRoomUsers(User.room)
        });
    });

    socket.on('chatMessage', (msg)=>{
        //find current user using current socket id
        const User = getCurrentUser(socket.id);
        io.to(User.room).emit('message',formatMessage(User.username, msg));
    });

    socket.on('disconnect',()=>{

        //remove this user from users array but delete function will return that user
        const User = removeUser(socket.id);
        if(User){
            io.to(User.room).emit('message', formatMessage('ChatBot',`${User.username} has left the chat..`));
            //return room and users information
            io.to(User.room).emit('roomUser', {
                room: User.room,
                users: getRoomUsers(User.room)
            });
        }
       
    })

   
})
app.listen(3000,()=>{
    console.log('Listening on 3000');
})