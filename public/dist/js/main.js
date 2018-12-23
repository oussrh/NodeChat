const connect = () => {
    if (localStorage.getItem("user") !== null) {

        let authData = JSON.parse(localStorage.getItem("user")); //JWT token
        userid = authData.userId;
        userToken = authData.token;
        document.getElementById('cnx').style.display = "none";

        //*******************************************************************/
        const getChatLsit = async () => {
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
                a.innerHTML = response[0].name;
                panel.appendChild(a);
            });
        }
        getChatLsit()
        ///***********************************************************/
        // Look for a user (search input)
        const lookForUser = async (u) => {
            user = u.currentTarget.value;
            let response = await fetch(`${url}/user/u/${user}/${userid}`, {
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
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userid,
                        withId: i.currentTarget.id
                    })
                })
                .catch(err => console.warn(err));
            getChatLsit(); //refresh list
        }
        //*********************************************************************/
        const openDiscussion = async i => {
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
                let p = document.createElement('p');
                p.className = "msgChat"
                p.innerHTML = m.msg;
                if (m.senderId == userid) {
                    p.style.color = 'red';
                } else {
                    p.style.color = 'green';
                }
                section.appendChild(p);
            })

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
            if (e.keyCode === 13) addMsg(e)
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