let url = "http://localhost:8080";
let socket = io.connect(url);

//************Register new user*****************/
const addUser = async () => {
    let name = await document.getElementById('name').value;
    let lastname = await document.getElementById('lname').value;
    let email = await document.getElementById('email').value;
    let password = await document.getElementById('pwd').value;
    let response = await fetch(url+"/user/register", {
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
    response = await response.json();
    if (response.error) {
        let logStatus = document.querySelector('#registerStatus');
        logStatus.innerHTML = "";
        logStatus.style.display = "block";
        let notif = document.createElement('div');
        notif.className = "notification is-danger";
        notif.innerHTML = response.error;
        logStatus.appendChild(notif);
    } else {
    localStorage.setItem('user', JSON.stringify(response));
    document.getElementById('cnx').style.display = "none";
    testCnx();
    }
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
    if (response.error) {
        let logStatus = document.querySelector('#loginStatus');
        logStatus.innerHTML = "";
        logStatus.style.display = "block";
        let notif = document.createElement('div');
        notif.className = "notification is-danger";
        notif.innerHTML = response.error;
        logStatus.appendChild(notif);
    } else {
        localStorage.setItem('user', JSON.stringify(response));
        document.getElementById('cnx').style.display = "none";
        connect();
    }
}
let formLoginSubmit = document.getElementById('submitLogin');
formLoginSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    logUser();
});

//**********************Logout****************************/
const logout = () => {
    localStorage.clear();
    document.getElementById('cnx').style.display = "block";
}
let userLogoutBt = document.getElementById('userLogout');
userLogoutBt.addEventListener('click', logout);