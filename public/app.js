function login(){
    const form = document.getElementById("login_form");

    switch(form.style.display){
        case form.style.display="none":
            form.style.display = "block"
            break;
        case form.style.display="block":
            form.style.display = "none"
            break;
    }
}

document.getElementById("login_button").onclick = login;