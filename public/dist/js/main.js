let url = "http://localhost:8080";
//**********************************************/
//************Register new user*****************/
const addUser = async () => {
    let name = await document.getElementById('name').value;
    let lastname = await document.getElementById('lname').value;
    let email = await document.getElementById('email').value;
    let password = await document.getElementById('pwd').value;
    await fetch(url + "/user/register", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
                "name": name,
                "lastName": lastname
            })
        })
        .catch(error => console.warn(error));
    document.getElementById('cnx').style.display = "none";
}
let formRegisterSubmit = document.getElementById('submitRegister');
formRegisterSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    addUser();
});
//************Login user**************** */
const logUser = async () => {
    let email = await document.getElementById('loginEmail').value;
    let password = await document.getElementById('loginPwd').value;
    let response = await fetch(url + '/user/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })
        .catch(err => console.warn(err));
    response = await response.json();
    localStorage.setItem('user', JSON.stringify(response));
    document.getElementById('cnx').style.display = "none";

}
let formLoginSubmit = document.getElementById('submitLogin');
formLoginSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    logUser();
});
//*********************************************************/
//**********************Logout****************************/
const logout = () => {
    localStorage.clear();
    document.getElementById('cnx').style.display = "block";
}
let userLogoutBt = document.getElementById('userLogout');
userLogoutBt.addEventListener('click', logout);
//******************************************************* */
if (localStorage.getItem("user")) {
    let authData = JSON.parse(localStorage.getItem("user"));
    userid = authData.userId;
    userToken = authData.token;
    document.getElementById('cnx').style.display = "none";
    // Look for a user (search input)
    const lookForUser = async (u) => {
        user = u.currentTarget.value;
        let response = await fetch(url + "/user/u/" + user, {
                method: "GET",
            })
            .catch((err) => console.warn(err));
        response = await response.json();
        showUsersMatch(response);
    }

    const showUsersMatch = (user) => {
        let ul = document.getElementById('lookForList');
        ul.style.display = "inherit";
        ul.innerHTML = "";
        user.map(u => {
            let li = document.createElement('li');
            li.innerHTML = `${u.email}<span class="icon"><i class="fas fa-plus"></i></span></li>`;
            li.id = u._id;
            li.dataset.id = userid;
            li.addEventListener('click', createUserChat);
            ul.appendChild(li);
        });
    }

    document.getElementById('lookforinput').addEventListener('keyup', function (u) {
        let ul = document.getElementById('lookForList');
        u.currentTarget.value !== '' ? lookForUser(u) : ul.style.display = "none";
    });
    //******************************************************************** */

    const createUserChat = async (i) => {
        await fetch(url + '/chat/i', {
                metloginPwdhod: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    userId: i.currentTarget.dataset.id,
                    withId: i.currentTarget.id
                })
            })
            .catch(err => console.warn(err));
        getChatLsit(); //refresh list
    }

    const getChatLsit = async () => {
        let response = await fetch(url + "/chat/i/" + userid, {
                method: "GET"
            })
            .catch((err) => console.warn(err));
        response = await response.json();
        showChatList(response);
    }

    const showChatList = list => {
        list.map(async l => {
            let panel = document.querySelector('.panel');
            panel.innerHTML = "";
            let a = document.createElement('a');
            a.className = "panel-block";
            a.id = l._id; //chat id;
            a.addEventListener("click", openDiscussion);
            let response = await fetch(url + "/chat/with/" + l.withId, {
                    method: "GET"
                })
                .catch(err => console.warn(err));
            response = await response.json();
            a.innerHTML = response[0].name;
            panel.appendChild(a);
        })
    }
    //*********************************************************************/
    const openDiscussion = async i => {
        let input = document.querySelector('.inputmsg');
        let idchat = i.currentTarget.id;
        input.id = idchat;
        let response = await fetch(`${url}/msg/${idchat}`, {
                method: "GET"
            })
            .catch(err => console.warn(err));
        response = await response.json();
        showDiscussion(response);
    }

    const showDiscussion = (d) => {
        let input = document.querySelector('.inputmsg');
        input.value = "";
        let section = document.getElementById('msgflow');
        section.innerHTML = ''
        d.map(m => {
            let p = document.createElement('p');
            p.className = "msgChat"
            p.innerHTML = m.msg;
            section.appendChild(p);
        })

        section.scrollTop = section.scrollHeight;

    }

    getChatLsit();
    //********************************************************************/

    const addMsg = async m => {
        let idchat = m.currentTarget.id;
        await fetch(`${url}/msg`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userid,
                    chatId: m.currentTarget.id,
                    msg: m.currentTarget.value
                })
            })
            .catch(err => console.warn(err));
        let response = await fetch(`${url}/msg/${idchat}`, {
                method: "GET"
            })
            .catch(err => console.warn(err));
        response = await response.json();
        showDiscussion(response);

    }
    document.querySelector('.inputmsg').addEventListener('keyup', (e) => {
        if (e.keyCode === 13) addMsg(e)
    })

} else {
    document.getElementById('cnx').style.display = "block";
}
/********************* */