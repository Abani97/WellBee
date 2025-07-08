let journalArr = [];
const sidepane = document.querySelector(".side-pane");

sidepane.addEventListener("click", (ev) => {
    console.log(ev.target.dataset);
    switch (ev.target.dataset.id) {
        case "dashboard":
            window.location.href = "/dashboard";
            break;
        case "meditation-timer":
            window.location.href = "/meditation";
            break;
        case "journal":
            break;
        default:
            break;
    }
});
const sampleHtml = `
<li class="journals" data-id="#journalId#">
    <div class="j-date">
        <div class="date">#date#</div>
        <span>|</span>
        <div class="day">#day#</div>
    </div>
    <div class="j-title pointer" data-id="#journalId#">#title#</div>
    <span class="pointer" data-id="#journalId#">#mood#</span>
    <div class="journal-content pointer" data-id="#journalId#">
        #htmlstring#
    </div>
</li>
`;

$(document).ready(async function () {
    const response = await fetch("/getJournal", {
        method: "POST",
    });
    const jsonResp = await response.json();
    journalArr = jsonResp.journals;
    renderJournals(journalArr);
});

function renderJournals(arr) {
    let newHtml = "";
    $.each(arr, function (idx, obj) {
        const date = new Date(obj.date).toDateString();
        newHtml += sampleHtml
            .replaceAll("#journalId#", obj.id)
            .replace("#date#", date.slice(4))
            .replace("#day#", date.slice(0, 3))
            .replace("#title#", obj.title)
            .replace("#mood#", obj.mood)
            .replace("#htmlstring#", obj.html);
    });
    $(".journals-wrapper").html(newHtml);
}

$(".journals-wrapper").click(function (e) {
    e.preventDefault();
    if ($(e.target).data("id")) {
        window.location.href = `/journalEditor?id=${$(e.target).data("id")}`;
    }
});

$(".add-journal").click(function (e) {
    e.preventDefault();
    window.location.href = "/journalEditor";
});

const searchBox = document.getElementById("input-box");
searchBox.addEventListener("input", () => {
    const val = searchBox.value;
    let displayArr = [];
    if (val) {
        displayArr = journalArr.filter((obj) => {
            return obj.title.includes(val) || obj.html.includes(val) || obj.mood.includes(val);
        });
    } else {
        displayArr = journalArr;
    }
    renderJournals(displayArr);
});
