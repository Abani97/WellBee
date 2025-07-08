const graphCtx = document.getElementById("meditation-graph");

$(document).ready(function () {
    getSessionsFromServer().then((data) => {
        createGraph(data);
    });
});

async function getSessionsFromServer() {
    const data = new Array(10).fill(0);
    const response = await fetch("/getMeditationSessions", {
        method: "POST",
    });
    const respJson = await response.json();
    console.log(respJson);
    const sessionLength = respJson.data.length;
    $.each(respJson.data, (idx, obj) => {
        data[sessionLength - idx - 1] = Math.round(obj.seconds / 60);
    });
    console.log(data);
    return data;
}

function createGraph(data) {
    new Chart(graphCtx, {
        type: "line",
        data: {
            labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"],
            datasets: [
                {
                    label: "Meditation Graph",
                    data: data,
                    borderWidth: 7,
                    pointBorderWidth: 0,
                    pointHitRadius: 10,
                    pointHoverRadius: 10,
                    hoverBorderWidth: 7,
                    borderColor: "#FF975D",
                    pointHoverBackgroundColor: "#FF6A61",
                    lineTension: 0.3,
                    label: " Minutes Spent",
                    font: "Puvi",
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false,
                    },
                    ticks: {
                        // display: false,
                    },
                    title: {
                        display: true,
                        text: "Minutes Spent",
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        font: {
                            family: "Puvi",
                            color: "#081D1D",
                            size: "15px",
                        },
                    },
                    title: {
                        display: true,
                        text: "Past 10 sessions",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            backgroundColor: "#FF975D",
            responsive: true,
            maintainAspectRatio: false,
        },
    });
}
