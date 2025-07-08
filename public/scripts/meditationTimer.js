const zenmode = document.getElementById("zenmode");
const music = document.getElementById("music");
const wrapper = document.querySelector(".wrapper");
const mainContainer = document.querySelector(".main-container");
const settingsPane = document.querySelector(".m-settings-pane");
const allMeditations = document.querySelector(".m-explore-pane");
const sidepane = document.querySelector(".side-pane");

sidepane.addEventListener("click", (ev) => {
    console.log(ev.target.dataset);
    switch (ev.target.dataset.id) {
        case "dashboard":
            window.location.href = "/dashboard";
            break;
        case "meditation-timer":
            break;
        case "journal":
            window.location.href = "/journal";
            break;
        default:
            break;
    }
});

let timer, timeLeft;
let passedTime = 0;
let paused = false;

zenmode.addEventListener("click", (ev) => {
    if (ev.target.checked) {
        mainContainer.classList.add("zenMode-bg");
        settingsPane.classList.add("zenMode-black");
        allMeditations.classList.add("zenMode-black");
        $(".timerDarker").addClass("timerZenMode");
        $(".realTimerFinalVersionV2").addClass("zenMode-bg");
    } else {
        mainContainer.classList.remove("zenMode-bg");
        settingsPane.classList.remove("zenMode-black");
        allMeditations.classList.remove("zenMode-black");
        $(".timerDarker").removeClass("timerZenMode");
        $(".realTimerFinalVersionV2").removeClass("zenMode-bg");
    }
});

const meditationTime = $("#meditationTime");
meditationTime.on("blur", function () {
    if (meditationTime.val() < 1) {
        meditationTime.val(1);
    } else if (meditationTime.val() > 60) {
        meditationTime.val(60);
    }
});

let audio;
mainContainer.addEventListener("click", (ev) => {
    if (ev.target.dataset.meditation) {
        let clickedMeditation = ev.target.dataset.meditation;
        $(".wrapper").css({ transform: "translate(-100vw)", opacity: 0 });
        $(".timerWrapper").css({
            transform: "translate(-50%, -50%)",
            opacity: 1,
            background: `url("../media/svg\ files/svg-images-meditation/${clickedMeditation}.svg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
        });
        $(".minutes").text(meditationTime.val());
        $(".seconds").text("00");
        audio = new Audio(`../media/music/${clickedMeditation}.mp3`);
        startTimer();
    }
});

$("#quit").click(() => {
    sendTimeToServer(passedTime);
    $(".wrapper").css({ transform: "translate(0%)", opacity: 1 });
    $(".timerWrapper").css({
        transform: "translate(60%, -50%)",
        opacity: 0,
    });
    stopTimer();
    passedTime = 0;
    paused = false;
    $(".pauseResume span").text("Pause");
    $(".pauseResume i").removeClass("fa-play");
    audio.pause();
});

function initNewTimerButton() {
    $(".pauseResume").off("click");
    $(".pauseResume i").addClass("fa-pause").removeClass("fa-circle-check");
    $(".pauseResume span").text("Pause");
    $(".pauseResume").click(function () {
        paused ? startTimer() : stopTimer();
        paused ? audio.play() : audio.pause();
        const textString = paused ? "Pause" : "Resume";
        $(".pauseResume i").toggleClass("fa-play");
        $(".pauseResume span").text(textString);
        paused = !paused;
    });
}

function startTimer() {
    const totalTime = +meditationTime.val() * 60;
    initNewTimerButton();
    if (music.checked) {
        audio.play();
    }

    timer = setInterval(function () {
        if (passedTime >= totalTime) {
            audio.pause();
            sendTimeToServer(passedTime);
            passedTime = 0;
            stopTimer();
            $(".wrapper").removeClass(".gradientFast");
            $(".pauseResume").off("click");
            $(".pauseResume span").text("Completed!");
            $(".pauseResume i").removeClass("fa-pause").addClass("fa-circle-check");
            $(".pauseResume").click(function () {
                $(".wrapper").css({
                    transform: "translate(0%)",
                    opacity: 1,
                });
                $(".timerWrapper").css({
                    transform: "translate(50%, -50%)",
                    opacity: 0,
                });
                paused = false;
            });
        } else {
            ++passedTime;
            timeLeft = totalTime - passedTime;
            const minutes = String(Math.floor(timeLeft / 60)).padStart(2, 0);
            const seconds = String(Math.floor(timeLeft % 60)).padStart(2, 0);
            $(".minutes").text(minutes);
            $(".seconds").text(seconds);
        }
    }, 1000);
}

// Just for the sake of an antonym function to startTimer, looks cool
function stopTimer() {
    clearInterval(timer);
}

async function sendTimeToServer(seconds) {
    if (seconds == 0) {
        return;
    }
    const response = await fetch("/setMeditationSession", {
        method: "POST",
        body: JSON.stringify({ seconds: seconds }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const respJson = await response.json();
    console.log(respJson);
    console.log("you meditated for ", seconds, "seconds!");
}
