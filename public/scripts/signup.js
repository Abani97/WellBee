const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {
    console.log("form is being submitted");
    e.preventDefault();
    validateInput();
});

function validEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

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
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (usernameValue === "") {
        setInvalidCase(username, "Username is required");
    } else {
        setValidCase(username);
    }

    if (emailValue === "") {
        return setInvalidCase(email, "Please enter your email");
    } else if (!validEmail(emailValue)) {
        return setInvalidCase(email, "Please enter a vaild Email Id");
    } else {
        setValidCase(email);
    }

    if (passwordValue === "") {
        return setInvalidCase(password, "Password is required");
    } else if (passwordValue.length < 8) {
        return setInvalidCase(
            password,
            "Password must be at least 8 characters."
        );
    } else {
        setValidCase(password);
    }

    if (password2Value === "") {
        return setInvalidCase(password2, "Please confirm your password");
    } else if (password2Value !== passwordValue) {
        return setInvalidCase(password2, "Passwords doesn't match");
    } else {
        setValidCase(password2);
    }
    console.log("All test passed!");

    const data = {
        email: emailValue,
        password: passwordValue,
        username: usernameValue,
    };
    const request = await fetch("/signup", {
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
            password2,
            "Welcome! You're one step closer to a healthier mind. How are you feeling today?",
            "green"
        );
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1000);
    } else if (response.error === "auth/network-request-failed") {
        setInvalidCase(password2, "Network Error!");
    } else if (
        response.error === "auth/email-already-exists" ||
        response.error === "auth/email-already-in-use"
    ) {
        setInvalidCase(
            email,
            "Account with this email already exists. Try logging in?"
        );
    }
}
