const form = document.querySelector('form');
const chat = document.querySelector('input');
const div = document.getElementById('head');
const roomName = document.getElementById('roomName');
const allUsers = document.getElementById('allUsers');
//get username and room from url
const {user, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
}); 

const socket = io();

//sending joinRoom from client to server side
socket.emit('joinRoom', {user, room});

//receiving from server and displaying on client side
socket.on('message', (msg)=>{
    // console.log(msg);
    displayMessage(msg);
})

// responding to roomUser i.e., displaying current room and list of users in room
socket.on('roomUser',(obj)=>{
    displayRoom(obj.room);
    displayUsers(obj.users);
})

form.addEventListener('submit',(e)=>{
    //prevent default behaviour
    e.preventDefault();
    const msg = chat.value;

    //emit this message to server
    socket.emit('chatMessage', msg);

    //clearing the input field
    chat.value = '';
    chat.focus();
})

function displayMessage(msg){
    const li = document.createElement('li');
    const h4 = document.createElement('h4');
    const p = document.createElement('p');
    h4.innerText = msg.username;
    li.innerText = msg.message;
    p.innerText = msg.time;
    div.appendChild(h4);
    div.appendChild(li);
    div.appendChild(p);
}

function displayRoom(r){
    roomName.innerText =r;
}
function displayUsers(users){
    removeExisting();
    for(let i = 0; i< users.length; i++){
        let li = document.createElement('li');
        li.innerText = users[i].username;
        allUsers.appendChild(li);
    }
}

//this function is to remove all appened li items
function removeExisting(){
    while(allUsers.firstChild){
        allUsers.removeChild(allUsers.firstChild);
    }
}