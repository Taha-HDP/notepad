$(".user").focusin(function () {
    $(".inputUserIcon").css("color", "#4187f6");
}).focusout(function () {
    $(".inputUserIcon").css("color", "white");
});
$(".pass").focusin(function () {
    $(".inputPassIcon").css("color", "#4187f6");
}).focusout(function () {
    $(".inputPassIcon").css("color", "white");
});

$("#signup").click(() => {
    document.getElementById("inputs").style.display = "none";
    document.getElementsByClassName("Signup")[0].style.display = "block";
});
$("#having_account").click(() => {
    document.getElementById("inputs").style.display = "block";
    document.getElementsByClassName("Signup")[0].style.display = "none";
})
$('.email').on("change keyup paste",
    function () {
        if ($(this).val()) {
            $('.icon-paper-plane').addClass("next");
        } else {
            $('.icon-paper-plane').removeClass("next");
        }
    }
);
$('.next-button').hover(
    function () {
        $(this).css('cursor', 'pointer');
    }
);
$('.next-button.email').click(
    function () {
        $('.email-section').addClass("fold-up");
        $('.password-section').removeClass("folded");
        step++;
    }
);
let lastPass, step = 0;
$('.password').on("change keyup paste",
    function () {
        if ($(this).val().length >= 6) {
            lastPass = $(this).val();
            $('.icon-lock').addClass("next");
        } else {
            $('.icon-lock').removeClass("next");
        }
    }
);
$('.next-button').hover(
    function () {
        $(this).css('cursor', 'pointer');
    }
);
$('.next-button.password').click(
    function () {
        $('.password-section').addClass("fold-up");
        $('.repeat-password-section').removeClass("folded");
        step++;
    }
);
$('.repeat-password').on("change keyup paste",
    function () {
        if ($(this).val().length >= 6 && $(this).val() == lastPass) {
            $('.icon-repeat-lock').addClass("next");
        } else {
            $('.icon-repeat-lock').removeClass("next");
        }
    }
);
$('.next-button.repeat-password').click(()=>{
    $('.repeat-password-section').addClass("fold-up");
    $('.success').css("marginTop", 0);
    $("#backStep").text("");
    step++;
}
);
$('.success').click(()=>{
    window.location.assign("/home.html");
})
$("#backStep").click(() => {
    if (step == 0)
        return 0;
    $("." + step).removeClass("fold-up");
    let secound = step + 1;
    $("." + secound).addClass("folded");
    step--;
})

$(".addNote").click(() => {
    window.location.assign("/add_note.html")
});
