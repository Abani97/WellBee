const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

form.addEventListener("submit", (e) => {
    console.log("form is being submitted");
    e.preventDefault();
    validateInput();
});

const setInvalidCase = (ele, msg, color = "red") => {
    const inputField = ele.parentElement;
    const errorBox = inputField.querySelector(".error");
    errorBox.style.color = color;
    errorBox.innerText = msg;
};

const setValidCase = (ele) => {
    const inputField = ele.parentElement;
    const errorBox = inputField.querySelector(".error");
    errorBox.innerText = "";
};

async function validateInput() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if (emailValue === "") {
        return setInvalidCase(email, "Email is required");
    } else if (!emailRegex.test(emailValue)) {
        return setInvalidCase(email, "Please enter a correct email address!");
    } else {
        setValidCase(email);
    }

    if (passwordValue === "") {
        return setInvalidCase(password, "Password is required");
    } else {
        setValidCase(password);
    }

    const data = { email: emailValue, password: passwordValue };

    const request = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.success) {
        document.cookie = `token=${response.token}; path=/`;
        setInvalidCase(
            password,
            "Welcome back! You're one step closer to a healthier mind. How are you feeling today?",
            "green"
        );
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1000);
    } else if (response.error === "auth/invalid-credential") {
        setInvalidCase(
            password,
            "Looks like the credentials are invalid. Let's try again!"
        );
    } else if (response.error === "auth/network-request-failed") {
        setInvalidCase(password, "Network Error!");
    }
}
