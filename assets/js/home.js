const FieldDiv = document.getElementById("field-section")
const logtype = FieldDiv.getAttribute("data-usertype");

const register = document.getElementById('register');
const login = document.getElementById('login');
const airline = document.getElementById('airline');

console.log(logtype);
if(logtype == 1){
    register.style = "background: linear-gradient(to top right, #5cb1ff 0%, #0f63f6 100%);color: white;";
    login.style = "background: inherit;color: black;";
    airline.style = "background: inherit;color: black;";
}
else if(logtype == 2){
    login.style = "background: linear-gradient(to top right, #5cb1ff 0%, #0f63f6 100%);color: white;";
    register.style = "background: inherit;color: black;";
    airline.style = "background: inherit;color: black;";
}
else{
    airline.style = "background: linear-gradient(to top right, #5cb1ff 0%, #0f63f6 100%);color: white;";
    login.style = "background: inherit;color: black;";
    register.style = "background: inherit;color: black;";
}