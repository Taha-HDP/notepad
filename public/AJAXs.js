const domain = "http://localhost:3000";
$(document).ready(() => {
    if (window.location.pathname != "/") {
        const token = localStorage.getItem("token");
        if (!token)
            window.location.assign("/")
    }
    if (window.location.pathname == "/profile.html") {
        const id = localStorage.getItem("token");
        axios.get(domain + "/api/member_info", {
            headers: {
                'x-auth-token': id
            }
        }).then(res => {
            $("#username").val(res.data.username);
            $("#email").val(res.data.email);
            $("#fname").val(res.data.first_name);
            $("#lname").val(res.data.last_name);
        });
    }
    if (window.location.pathname == "/home.html") {
        const id = localStorage.getItem("token");
        axios.get(domain + "/api/notes", {
            headers: {
                'x-auth-token': id
            }
        }).then(res => {
            res.data.map((data) => {
                const note = document.createElement("div");
                note.classList.add("note");
                note.innerHTML = `
                    <a href="/add_note.html?id=${data._id}">
                        <h3 class="noteName">${data.name}</h3>
                        <p class="noteDate">${data.create_date}</p>
                    </a>
                    <span class="delete" id="${data._id}"><i class="fa-solid fa-trash-can"></i></span>
                    `;
                $("#main").append(note);
                document.getElementById(data._id).addEventListener("click", () => {
                    const id = localStorage.getItem("token");
                    axios.delete(domain + "/api/delete/" + data._id, {
                        headers: {
                            'x-auth-token': id
                        }
                    }).then(res => {
                        let text = "successfully Deleted";
                        call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
                    });
                })
            });
        });
    }
    const placeID = new URLSearchParams(window.location.search).get("id");
    if (placeID) {
        const id = localStorage.getItem("token");
        axios.get(domain + "/api/getNote/" + placeID, {
            headers: {
                'x-auth-token': id
            }
        }).then(res => {
            $("#note_name").val(res.data.name),
                $("#note_data").val(res.data.text)
        });
    }
})
$(".submit").click(() => {
    if (!$("#username_input").val() || !$("#password_input").val()) {
        let text = "you must compelete all section";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return false;
    }
    const body = {
        username: $("#username_input").val(),
        password: $("#password_input").val()
    }
    axios.post(domain + "/api/login", body).then(res => {
        localStorage.setItem("token", res.headers["x-auth-token"]);
        window.location.assign("/home.html");
        return false;
    }).catch(err => {
        window.scroll(0, 0);
        let text = "Not found";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return false;
    });
    return false;
});
$('.next-button.repeat-password').click(() => {
    const body = {
        email: $("#email_input").val(),
        password: $("#signUp_pass").val()
    }
    axios.post(domain + "/api/signUp", body).then(res => {
        localStorage.setItem("token", res.headers["x-auth-token"]);
        return false;
    }).catch(err => {
        window.scroll(0, 0);
        let text = "This user exists";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        $('.repeat-password-section').removeClass("fold-up");
        $('.success').css("marginTop", "-75px");
        $("#backStep").text("Back");
        return false;
    });
    return false;
});
$("#exit_acc").click(() => {
    localStorage.removeItem("token");
    window.location.assign("/");
});
$("#change_info").click(() => {
    if (!$("#username").val() || !$("#email").val()) {
        let text = "You must complete all section";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return 0;
    }
    const body = {
        username: $("#username").val(),
        email: $("#email").val(),
        first_name: $("#fname").val(),
        last_name: $("#lname").val(),
    }
    const id = localStorage.getItem("token");
    axios.put(domain + "/api/editInfo", body, {
        headers: {
            'x-auth-token': id
        }
    }).then(res => {
        let text = "successfully Saved";
        call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
    }).catch(err => {
        let text = "This Email / ID is exist";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
    });
});
$("#change_password").click(() => {
    if (!$("#current_pass").val() || !$("#new_pass").val()) {
        let text = "You must complete all section";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return 0;
    }
    if ($("#new_pass").val().length < 6) {
        let text = "The new password must be 6 characters";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return 0;
    }
    const body = {
        current_password: $("#current_pass").val(),
        new_password: $("#new_pass").val()
    }
    const id = localStorage.getItem("token");
    axios.put(domain + "/api/changePassword", body, {
        headers: {
            'x-auth-token': id
        }
    }).then(res => {
        let text = "successfully Changed";
        call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
    }).catch(err => {
        let text = "Password is invalid";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
    });
});
$("#btn").click(() => {
    if (!$("#note_name").val() || !$("#note_data").val()) {
        let text = "You must complete all section";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
        return 0;
    }
    let body = {
        name: $("#note_name").val(),
        text: $("#note_data").val()
    }
    const id = localStorage.getItem("token");
    const placeID = new URLSearchParams(window.location.search).get("id");
    if (!placeID) {
        axios.post(domain + "/api/addNote", body, {
            headers: {
                'x-auth-token': id
            }
        }).then(res => {
            let text = "successfully Added";
            call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
        });
    } else {
        axios.put(domain + "/api/editNote/" + placeID, body, {
            headers: {
                'x-auth-token': id
            }
        }).then(res => {
            let text = "successfully Changed";
            call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
        });
    }
});
let level = 0, code , email;
$("#submit").click(() => {
    if ($("#email").val()) {
        if (level == 0) {
            axios.get(domain + "/api/send_email/" + $("#email").val()).then(res => {
                let text = "Email sent";
                call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
                level++;
                code = res.data.val;
                email = $("#email").val()
                document.getElementById("label").innerText = "Enter the code sent in the email";
                $("#email").val("");
                $("#email").attr("placeholder", "- - - -");
            }).catch(() => {
                let text = "this Email didn't exist";
                call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
            });
        } else if (level == 1) {
            if ($("#email").val() == code) {
                level++;
                document.getElementById("label").innerText = "Enter your new password (minimum : 6 characters)";
                $("#email").val("");
                $("#email").attr("placeholder", "New Password");
            } else {
                let text = "invalid code";
                call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
            }
        } else if (level == 2) {
            if ($("#email").val().length >= 6) {
                const body={
                   password : $("#email").val() ,
                   email : email 
                }
                axios.put(domain + "/api/new_password/",body).then(res => {
                    let text = "Password changed";
                    call_cs_popup(text, 4000, "#277539", "#DAFFE6", "#20A740");
                    level = 0;
                    code = "";
                    window.location.assign('/');
                })
            } else {
                let text = "Password must be at least 6 characters long";
                call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
            }

        }

    } else {
        let text = "you must compelete all section";
        call_cs_popup(text, 4000, "#5D101D", "#ffd5da", "#390b1b");
    }
});
function call_cs_popup(text, time, color, background, stroke) {
    const notif = document.getElementById("notfication");
    document.querySelector("#notfication p").innerHTML = text;
    notif.style.color = color;
    notif.style.border = "1px solid " + stroke;
    notif.style.backgroundColor = background;
    notif.style.transform = "translateX(0px)";
    document.getElementById("notif_icon").style.borderLeft = "1px solid" + stroke;
    if (background == "#DAFFE6") {
        document.getElementById("notif_image").style.backgroundImage = "url(./public/cheked_icon.png)";
    } else if (background == "#ffd5da") {
        document.getElementById("notif_image").style.backgroundImage = "url(./public/wrong_icon.png)";
    }
    if (time != 0) {
        setTimeout(() => {
            notif.style.transform = "translateX(-1000px)";
        }, time);
    }
}