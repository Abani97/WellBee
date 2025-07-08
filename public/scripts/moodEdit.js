let EMOJIDATA = {};

function addEmojiToObject(date, month, year, emoji) {
    if (!EMOJIDATA[year]) {
        EMOJIDATA[year] = {};
    }
    if (!EMOJIDATA[year][month]) {
        EMOJIDATA[year][month] = {};
    }
    // If the year or month don't already exists, create new empty ones. It threw an error otherwise:/
    EMOJIDATA[year][month][date] = [emoji];
}

function getDataFromObject(date, month, year) {
    return EMOJIDATA[year][month][date];
}

function notMoodExists(date, month, year) {
    return !EMOJIDATA[year] || !EMOJIDATA[year][month] || !EMOJIDATA[year][month][date];
}
