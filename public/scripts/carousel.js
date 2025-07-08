// These were for the dot thing but I couldn't position them :/

// const sliders = document.querySelectorAll(".sliders i");

// $(sliders.children).each(function (index, element) {
//     console.log(index, element.children);
// });

// $(sliders).click(function (e) {
//     // e.preventDefault();
//     sliders.forEach((slide) => {
//         $(slide).addClass("fa-regular");
//         $(slide).removeClass("fa-solid");
//     });

//     currentImg = e.target.dataset.img;

//     $(e.target).toggleClass("fa-regular");
//     $(e.target).toggleClass("fa-solid");
// });

let currentImg = 1;
let maxImages = 5;

const carousel = setInterval(() => {
    currentImg++;
    $(`[data-img=${currentImg}]`).click();
    $(document.body).css("backgroundColor", `var(--login-color-${currentImg})`);

    if (currentImg >= maxImages) {
        currentImg = 0;
    }
}, 3000);

const anchors = document.querySelectorAll("a");
// Prevents the url from changing everytime image changes
$(anchors).each(function (index, element) {
    if (
        element.getAttribute("href") == "/signup" || element.getAttribute("href") == "/login"
    ) {
        return;
    }
    $(element).click(function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
    });
});
