const habitParent = document.querySelector(".habit-list-tracker");
const reminderParent = document.querySelector(".r-list-wrapper");
const sidepane = document.querySelector(".side-pane");

sidepane.addEventListener("click", (ev) => {
    console.log(ev.target.dataset);
    switch (ev.target.dataset.id) {
        case "dashboard":
            break;
        case "meditation-timer":
            window.location.href = "/meditation";
            break;
        case "journal":
            window.location.href = "/journal";
            break;
        default:
            break;
    }
});

let habitDiv = `
<li class="habit #habitStatus#">
    <div class="habit-info">
        <div class="habit-name limitLines" title="#habitTitle#">#habitName#</div>
        <div class="habit-timing">#habitTime#</div>
    </div>
    <div class="habit-desc">
        #habitDesc#
    </div>
</li>
`;

let habitReminder = `
<li class="reminder">
    <div class="reminder-name">
        #reminderName#
    </div>
    <div class="reminder-desc">#reminderDesc#</div>
</li>
`;

async function loadHabits() {
    const response = await fetch("/getHabits", {
        method: "POST",
    });
    const respJson = await response.json();
    const habitArray = respJson.data;
    let newHtml = "";
    let reminderHtml = "";
    $.each(habitArray, (idx, obj) => {
        newHtml += habitDiv
            .replace("#habitStatus#", obj.isCompleted ? "completedHabit" : "yetToStart")
            .replace("#habitName#", obj.name)
            .replace("#habitTime#", obj.timeRange)
            .replace("#habitDesc#", obj.desc)
            .replace("#habitTitle#", obj.desc);
        if (!obj.isCompleted) {
            reminderHtml += habitReminder
                .replace("#reminderName#", obj.name)
                .replace("#reminderDesc#", obj.desc);
        }
    });
    habitParent.innerHTML += newHtml;
    reminderParent.innerHTML += reminderHtml;
}

async function getMoods() {
    const response = await fetch("/getMoods", {
        method: "POST",
    });
    const respJson = await response.json();
    const moodArray = respJson.data;
    console.log(moodArray);
    $.each(moodArray, (idx, obj) => {
        const dateString = new Date(obj.date).toLocaleDateString();
        addEmojiToObject(
            +dateString.slice(0, 2),
            +dateString.slice(3, 5) - 1,
            dateString.slice(6, 10),
            obj.mood
        );
    });
    addDates();
}

loadHabits();
getMoods();

$(".addNewHabit").click(function (e) {
    $(".addHabit").css({ top: "20px" });
});

$(".noHabit").click(function (e) {
    e.preventDefault();
    $(".addHabit").css({ top: "-50%" });
});

$(".submitHabit").click(async function (e) {
    e.preventDefault();
    const habitTitle = document.getElementById("habitTitle");
    const habitDesc = document.getElementById("habitDesc");
    const timeStart = document.getElementById("habitTimeStart");
    const timeEnd = document.getElementById("habitTimeEnd");

    if (!habitTitle.value || !habitDesc.value || !timeStart.value || !timeEnd.value) {
        console.log("works");
        return;
    }

    const response = await fetch("/addNewHabit", {
        method: "POST",
        body: JSON.stringify({
            name: habitTitle,
            desc: habitDesc,
            dayTime: `${timeStart} : ${timeEnd}`,
            isCompleted: false,
            lastUpdated: "14/03/2024",
        }),
    });
    const respJson = await response.json();
    console.log(respJson);
    $(".addHabit").css({ top: "-50%" });
});
