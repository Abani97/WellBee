const editor = document.querySelector("#editor");
let cked;
let queryParams = new URLSearchParams(window.location.search);
let type = queryParams.get("id") ? "edit" : "new";

function loadJournals() {
    if (type === "new") {
        const date = new Date();
        $(".day").text(date.toLocaleDateString("en-In", { weekday: "long" }));
        const dateString = date.toDateString();
        $(".date").text(dateString.slice(8, 10));
        $(".month").text(
            date.toLocaleDateString("en-In", { month: "long" }).slice(0, 3) + dateString.slice(10)
        );
    } else {
        const journalId = queryParams.get("id");
        getJournal(journalId).then(async (data) => {
            const response = await data.json();
            if (response.success) {
                console.log(response);
                $("#journalTitle").val(response.data.title);
                cked.setData(response.data.htmlString); // Set htmlString of journal inside ckeditor
                if (response.data.journalColor) {
                    $(`[data-color="${response.data.journalColor}"]`).click(); // Change journal color by simulating a click action
                }
                $(`[data-emoji="${response.data.mood}"]`).click(); // Changing mood by simulating a click action
                userMood = response.data.mood;

                // Editing date, nothing too much below
                const dateString = response.data.date;
                const parts = dateString.split(" ");
                const day = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1;
                var year = parseInt(parts[2], 10);
                const dateObject = new Date(year, month, day);
                const options = { month: "long" };
                const monthName = dateObject.toLocaleString("en-US", options);
                $(".day").text(year);
                $(".date").text(day);
                $(".month").text(monthName);
            }
        });
    }
}

async function getJournal(id) {
    const journalInfo = await fetch("/getSingleJournal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ journalId: id }),
    });
    return journalInfo;
}

document.addEventListener("DOMContentLoaded", () => {
    createEditor();
    loadJournals();
});

function createEditor() {
    CKEDITOR.ClassicEditor.create(editor, {
        toolbar: {
            items: [
                "|",
                "heading",
                "|",
                "bold",
                "italic",
                "strikethrough",
                "underline",
                "code",
                "subscript",
                "superscript",
                "removeFormat",
                "|",
                "bulletedList",
                "numberedList",
                "todoList",
                "|",
                "outdent",
                "indent",
                "|",
                "undo",
                "redo",
                "-",
                "fontSize",
                "fontFamily",
                "fontColor",
                "fontBackgroundColor",
                "highlight",
                "|",
                "alignment",
                "|",
                "link",
                "uploadImage",
                "mediaEmbed",
                "codeBlock",
                "|",
                "horizontalLine",
                "|",
            ],
            shouldNotGroupWhenFull: true,
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true,
            },
        },
        heading: {
            options: [
                {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                },
                {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                },
                {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                },
                {
                    model: "heading3",
                    view: "h3",
                    title: "Heading 3",
                    class: "ck-heading_heading3",
                },
                {
                    model: "heading4",
                    view: "h4",
                    title: "Heading 4",
                    class: "ck-heading_heading4",
                },
                {
                    model: "heading5",
                    view: "h5",
                    title: "Heading 5",
                    class: "ck-heading_heading5",
                },
                {
                    model: "heading6",
                    view: "h6",
                    title: "Heading 6",
                    class: "ck-heading_heading6",
                },
            ],
        },
        placeholder: "Add new Journal...",
        fontFamily: {
            options: [
                "default",
                "Zoho Puvi, serif",
                "Arial, Helvetica, sans-serif",
                "Courier New, Courier, monospace",
                "Georgia, serif",
                "Lucida Sans Unicode, Lucida Grande, sans-serif",
                "Tahoma, Geneva, sans-serif",
                "Times New Roman, Times, serif",
                "Trebuchet MS, Helvetica, sans-serif",
            ],
            supportAllValues: true,
        },
        fontSize: {
            options: [10, 12, 14, "default", 18, 20, 22],
            supportAllValues: true,
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true,
                },
            ],
        },
        htmlEmbed: {
            showPreviews: true,
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: "https://",
                toggleDownloadable: {
                    mode: "manual",
                    label: "Downloadable",
                    attributes: {
                        download: "file",
                    },
                },
            },
        },
        // The "superbuild" contains more premium features that require additional configuration, disable them below.
        // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
        removePlugins: [
            "AIAssistant",
            "CKBox",
            "CKFinder",
            "EasyImage",
            // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
            // Storing images as Base64 is usually a very bad idea.
            // Replace it on production website with other solutions:
            // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
            // 'Base64UploadAdapter',
            "RealTimeCollaborativeComments",
            "RealTimeCollaborativeTrackChanges",
            "RealTimeCollaborativeRevisionHistory",
            "PresenceList",
            "Comments",
            "TrackChanges",
            "TrackChangesData",
            "RevisionHistory",
            "Pagination",
            "WProofreader",
            "MathType",
            // The following features are part of the Productivity Pack and require additional license.
            "SlashCommand",
            "Template",
            "DocumentOutline",
            "FormatPainter",
            "TableOfContents",
            "PasteFromOfficeEnhanced",
            "CaseChange",
        ],
    }).then((editor) => {
        cked = editor;
    });
}

let journalColorChoice = "salmon";
let userMood = "weeping";

const colorChoices = document.querySelector(".color-choices");
colorChoices.addEventListener("click", (ev) => {
    if (ev.target.classList.contains("choice")) {
        $(".choice").removeClass("active-choice");
        $(ev.target).addClass("active-choice");
        journalColorChoice = ev.target.dataset.color;
        switch (ev.target.dataset.color) {
            case "salmon":
                $(".entry-page").css("backgroundColor", "#FFEBE5");
                document.documentElement.style.setProperty("--editor-color", "#FFEBE5");
                return;
            case "sky":
                $(".entry-page").css("backgroundColor", "#B4D7FF");
                document.documentElement.style.setProperty("--editor-color", "#B4D7FF");
                return;
            case "purple":
                $(".entry-page").css("backgroundColor", "#F1EDFF");
                document.documentElement.style.setProperty("--editor-color", "#F1EDFF");
                return;
            case "green":
                $(".entry-page").css("backgroundColor", "#EAFFEF");
                document.documentElement.style.setProperty("--editor-color", "#EAFFEF");
                return;
            default:
                return;
        }
    }
});

const emojiSelect = document.querySelector(".emoji");

let emojiOn = false;

$(".emojiList").click(function (e) {
    e.preventDefault();
    if (e.target.dataset.emoji) {
        userMood = e.target.dataset.emoji;
        const img = `<img src="media/emoji /#emoji#.svg"></img`;
        emojiSelect.innerHTML = img.replace("#emoji#", e.target.dataset.emoji);
    }
});

emojiSelect.addEventListener("click", () => {
    emojiOn = !emojiOn;
    $(".emojiList").width(emojiOn ? "240px" : "0px");
});

const saveBtn = document.querySelector(".save-btn");

saveBtn.addEventListener("click", async () => {
    console.log("i cant do anything mario");
    const htmlString = cked.getData();
    const title = $("#journalTitle").val();
    if (htmlString === "") {
        return;
    }

    const obj = {
        title: title,
        journal: htmlString,
        journalColor: journalColorChoice,
        type: type,
        mood: userMood,
    };

    if (type !== "new") {
        const queryParams = new URLSearchParams(window.location.search);
        obj.journalId = queryParams.get("id");
    }

    const response = await fetch("/addJournal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });
    const respJson = await response.json();
    if (type === "new") {
        updateQueryParams("id", respJson.id);
    }
    type = "edit";
});

// This function is used when user adds a new journal and saves it, so we change the url at top
function updateQueryParams(paramName, paramValue) {
    const url = new URL(window.location.href);
    const queryParams = new URLSearchParams(url.search);
    queryParams.set(paramName, paramValue);
    url.search = queryParams.toString();
    history.replaceState(null, "", url.toString());
}

document.querySelector(".left-wrapper").addEventListener("click", (ev) => {
    if (ev.target.dataset.btn === "back") {
        history.back();
    }
});
