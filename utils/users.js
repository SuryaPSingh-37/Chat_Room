const users = [];

// adding a user to users array
function addUser(id, username, room){
    const newUser = {id, username, room};
    users.push(newUser);
    return newUser;
};

//Function to get current user  (Used find funtion on array using user id)
function getCurrentUser(id){
    return users.find((user)=>{
        return user.id===id;
    })
}

//Function to delete current user
function removeUser(id){
    const index = users.findIndex((user)=>{
        return user.id===id;
    });
    if(index!=-1){
        const u = users[index];
        users.splice(index,1);
        return u;
    }
}

//get users of the current room
function getRoomUsers(r){
    return users.filter((u)=>{
        return u.room===r;
    });
}
module.exports = {
    addUser,
    getCurrentUser,
    removeUser,
    getRoomUsers
};


