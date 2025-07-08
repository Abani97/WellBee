const DAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
};

const MONTHS = {
    0: ["January", 31],
    1: [
        "February",
        function () {
            return isLeapYear() ? 29 : 28;
        },
    ],
    2: ["March", 31],
    3: ["April", 30],
    4: ["May", 31],
    5: ["June", 30],
    6: ["July", 31],
    7: ["August", 31],
    8: ["September", 30],
    9: ["October", 31],
    10: ["November", 30],
    11: ["December", 31],
};

const EMOJIS = {
    happy: "./media/emoji/happy.svg",
    okayish: "./media/emoji/okayish.svg",
    winking: "./media/emoji/winking.svg",
    weeping: "./media/emoji/weeping.svg",
};
