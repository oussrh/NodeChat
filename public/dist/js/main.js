const testToken = async () => {
    let authData = JSON.parse(localStorage.getItem("user")); //JWT token
    userToken = authData.token;
    await fetch(`${url}/user/cnx`, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            token:userToken
        })
    })
    .then( t => t.json())
    .then( token => {
        if(token.err === "expired"){
            localStorage.clear();
            document.getElementById('cnx').style.display = "block";
        }
    })
    .catch(err => console.warn(err));
};
const connect = () => {
    if (localStorage.getItem("user") !== null) {

        let authData = JSON.parse(localStorage.getItem("user")); //JWT token
        userid = authData.userId;
        userToken = authData.token;
        document.getElementById('cnx').style.display = "none";

        //*******************************************************************/
        const getChatLsit = async () => {
            testToken();
            let response = await fetch(url + "/chat/i/" + userid, {
                    method: "GET"
                })
                .catch((err) => console.warn(err));
            response = await response.json();
            response.map(async l => {
                let panel = document.querySelector('.panel');
                panel.innerHTML = "";
                let a = document.createElement('a');
                a.className = "panel-block";
                a.id = l.withId;
                a.addEventListener("click", openDiscussion);
                let response = await fetch(url + "/chat/with/" + l.withId, {
                        method: "GET"
                    })
                    .catch(err => console.warn(err));
                response = await response.json();
                a.innerHTML = /*html*/ `
                    <p class="contactName">${response[0].name}</p>
                    <span class="contactEmail">${response[0].email}</span>`;
                panel.appendChild(a);
            });
        }
        getChatLsit()
        ///***********************************************************/
        // Look for a user (search input)
        const lookForUser = async (u) => {
            testToken();
            user = u.currentTarget.value;
            let response = await fetch(`${url}/user/u/${user}/${userid}`, {
                    method: "GET",
                })
                .catch((err) => console.warn(err));
            response = await response.json();
            showUsersMatch(response);
        }

        const showUsersMatch = (user) => {
            testToken();
            let ul = document.getElementById('lookForList');
            ul.style.display = "inherit";
            ul.innerHTML = "";
            user.map(u => {
                let li = document.createElement('li');
                li.innerHTML = `${u.email}<span class="icon"><i class="fas fa-plus"></i></span></li>`;
                li.id = u._id; //with id
                li.addEventListener('click', createUserChat);
                ul.appendChild(li);
            });
        }

        document.getElementById('lookforinput').addEventListener('keyup', function (u) {
            let ul = document.getElementById('lookForList');
            u.currentTarget.value !== '' ? lookForUser(u) : ul.style.display = "none";
        });
        document.getElementById('lookforinput').addEventListener('click', function (u) {
            let ul = document.getElementById('lookForList');
            ul.style.display = "none";
        });

        //******************************************************************** */
        const createUserChat = async (i) => {
            let idwith = i.currentTarget.id;
            let response = await fetch(`${url}/chat/${idwith}/${userid}`, {
                method: 'GET'
            });
            response = await response.json();
            if (!response.length) {
                await fetch(`${url}/chat/i`, {
                        method: "POST",
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: userid,
                            withId: idwith
                        })
                    })
                    .catch(err => console.warn(err));
                getChatLsit(); //refresh list
            } else {
                let msg = await fetch(`${url}/msg/${idwith}/${userid}`, {
                        method: "GET"
                    })
                    .catch(err => console.warn(err));
                msg = await msg.json();
                let input = document.querySelector('.inputmsg');
                input.id = idwith;
                showDiscussion(msg)
            }
        }
        //*********************************************************************/
        const openDiscussion = async i => {
            testToken();
            let input = document.querySelector('.inputmsg');
            let withId = i.currentTarget.id;
            input.id = withId;
            let response = await fetch(`${url}/msg/${withId}/${userid}`, {
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
                let p = document.createElement('div');
                p.className = "msgChat";
                let today = new Date();
                let msgDate = new Date(m.Date);
                let timeDiff = today.getDate() - msgDate.getDate();
                let diffYears = today.getFullYear() - msgDate.getFullYear();
                var optionsFull = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                };
                var optionsTime = {
                    hour: 'numeric',
                    minute: 'numeric'
                };
                if (timeDiff === 0 && diffYears === 0) {
                    p.innerHTML = `<p>${m.msg}</p><span>Aujourd'hui à ${msgDate.toLocaleTimeString('fr-FR',optionsTime)}</span>`;
                } else if (timeDiff === 1 && diffYears === 0) {
                    p.innerHTML = `<p>${m.msg}</p><span>Hier à ${msgDate.toLocaleTimeString('fr-FR',optionsTime)}</span>`;
                } else {
                    p.innerHTML = `<p>${m.msg}</p><span>${msgDate.toLocaleDateString('fr-FR',optionsFull)}</span>`;
                }
                if (m.senderId == userid) {
                    p.className = 'msgChat leftChat';
                } else {
                    p.className = 'msgChat rightChat';
                }
                section.appendChild(p);
            })
            input.focus();
            section.scrollTop = section.scrollHeight; //scroll down
        }
        //********************************************************************/
        const addMsg = m => {
            socket.emit('chat', {
                senderId: userid,
                receiverId: m.currentTarget.id,
                msg: m.currentTarget.value
            });
        }
        document.querySelector('.inputmsg').addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                let msg = e.currentTarget.value;
                if(msg.trim() !== ""){
                    addMsg(e)
                }
                
            }
            
        })

        socket.on('chat', async (data) => {
            showDiscussion(data);
        });

    } else { //localstorage not defind 
        document.getElementById('cnx').style.display = "block";
    }

}
window.onload = function () {
    connect();
};

/********************* */