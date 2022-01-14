// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: code;

// Insert WakaTime API OAuth token here
const WAKATIME_ACCESS_TOKEN = "";

function getCurrentDate() {
    let now = new Date();
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
}

function formatSecondsToStringDuration(totalSeconds) {
    if (totalSeconds < 3600) {
        return new Date(totalSeconds * 1000).toISOString().substr(14, 5);
    } else {
        return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
    }
}

async function getData() {

    let request = new Request(`https://wakatime.com/api/v1/users/current/durations?date=${getCurrentDate()}`);
    request.method = "GET";
    request.headers = {
        "Authorization": `Bearer ${WAKATIME_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
    };

    let data = await request.loadJSON();
    const {branches} = data;

    let durationLog = data.data;
    let stringTotalDuration = "00:00:00";
    let totalSecondsOfActivity = 0;
    if (durationLog.length > 0) {
        totalSecondsOfActivity = durationLog.map(x => x.duration).reduce((a, b) => a + b);
        stringTotalDuration = formatSecondsToStringDuration(totalSecondsOfActivity);
    }

    return {branches, totalSecondsOfActivity, stringTotalDuration};
};

async function createWidget() {
    const {branches, timezone, totalSecondsOfActivity, stringTotalDuration} = await getData();

    let w = new ListWidget();

    let titleText = w.addText("Today's WakaTime\n\n" + stringTotalDuration);
    titleText.font = Font.boldSystemFont(15)
    titleText.textColor = new Color("#ffffff");

    w.backgroundColor = new Color("#000000");
    return w;
};

let widget = null;
if (config.runsInWidget) {
    widget = await createWidget();
    Script.setWidget(widget);
    Script.complete();
}
