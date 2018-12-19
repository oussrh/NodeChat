let url = "http://localhost:8080";
let userid = "5c179e7f321c74251f9d5cea"
//********************************* */
const addUser = async () =>{
    let name = await document.getElementById('name').value;
    let lastname = await document.getElementById('lname').value;
    let email = await document.getElementById('email').value;
    let password = await document.getElementById('pwd').value;
    await fetch(url+"/user",{
        method: 'POST',
        headers : {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            "email":email,
            "password":password,
            "name":name,
            "lastName":lastname
        })
    })
    .catch(error => console.warn(error));
    document.getElementById('cnx').style.display="none";
}
let formRegisterSubmit = document.getElementById('submitRegister');
formRegisterSubmit.addEventListener('click', function(e){
    e.preventDefault();
    addUser();
});

//******************************************************* */

const lookForUser = async (u) =>{
    user = u.currentTarget.value;
    let  response = await fetch(url+"/user/u/"+user,{method : "GET",})
    .catch((err) => console.warn(err));
    response = await response.json();
    showUsersMatch(response);  
}

const showUsersMatch = (user)=>{

    let ul = document.getElementById('lookForList');
    ul.style.display = "inherit";
    ul.innerHTML = "";
    user.map( u => {
        let li = document.createElement('li');
        li.innerHTML = `${u.email}<span class="icon"><i class="fas fa-plus"></i></span></li>`;
        li.id = u._id;
        li.dataset.id = userid;
        li.addEventListener('click',createUserChat);
        ul.appendChild(li);
    });  
}

document.getElementById('lookforinput').addEventListener('keyup', function(u){
    let ul = document.getElementById('lookForList');
    u.currentTarget.value !== '' ? lookForUser(u) : ul.style.display = "none";      
});
//******************************************************************** */

const createUserChat = async(i)=>{
    await fetch(url+'/chat/i',{
        method : "POST",
        headers:{'Content-type': 'application/json'},
        body: JSON.stringify({userId: i.currentTarget.dataset.id,withId: i.currentTarget.id})
    })
    .catch(err => console.warn(err));
    getChatLsit();
}


const getChatLsit = async() =>{
    let response = await fetch(url+"/chat/i/"+userid,{method:"GET"})
    .catch((err) => console.warn(err));
    response = await response.json();
    showChatList(response);
}

const showChatList = list =>{
    list.map( async l => {
        let panel = document.querySelector('.panel');
        panel.innerHTML = "";
        let a = document.createElement('a');
        a.className = "panel-block";
        a.id = l._id;
        let response = await fetch(url+"/chat/with/"+l.withId,{method:"GET"})
        .catch(err => console.warn(err));
        response = await response.json();
        a.innerHTML = response[0].name;
        panel.appendChild(a);
    })
}

getChatLsit();
