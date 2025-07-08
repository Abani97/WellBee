const firebaseConfig = require("../public/config/firebase");
const {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    getAuth,
} = require("firebase/auth");
const { initializeApp: initializeAdminApp } = require("firebase-admin/app");
const { initializeApp } = require("firebase/app");
const { collection, addDoc, getFirestore: getclientFs } = require("firebase/firestore");
const jwt = require("jsonwebtoken");
const express = require("express");
const path = require("path");
const router = express.Router();

const app = initializeAdminApp(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getclientFs(firebaseApp);

router.get("/login", (req, res) => {
    if (firebaseAuth.currentUser) {
        return res.redirect("/dashboard");
    } else {
        res.sendFile(path.join(__dirname, "..", "public", "login.html"));
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((currentUser) => {
            const user = currentUser.user;
            const token = jwt.sign(
                { userId: user.uid },
                "u*hyyXzYHVxVCaK&HupFNg2RDgG53wF%CuQ6yotXENnVo2@&gUze8#952a^Bvi$e5ft8",
                { expiresIn: "30d" }
            );
            return res.json({ success: true, user: user, token: token });
        })
        .catch((err) => {
            console.log(err);
            const errorCode = err.code;
            const errorMessage = err.message;
            console.log(errorCode);
            return res.json({
                success: false,
                error: errorCode,
                message: errorMessage,
            });
        });
});

router.get("/signup", (req, res) => {
    if (firebaseAuth.currentUser) {
        return res.redirect("/dashboard");
    } else {
        res.sendFile(path.join(__dirname, "..", "public", "signup.html"));
    }
});

router.post("/signup", (req, res) => {
    const { email, password, username } = req.body;
    const dbCol = collection(db, "users");
    createUserWithEmailAndPassword(firebaseAuth, email, password)
        .then(async (currentUser) => {
            const user = currentUser.user;
            const docRef = await addDoc(dbCol, {
                email: email,
                userName: username,
                uid: user.uid,
            });
            const token = jwt.sign(
                { userId: user.uid },
                "u*hyyXzYHVxVCaK&HupFNg2RDgG53wF%CuQ6yotXENnVo2@&gUze8#952a^Bvi$e5ft8",
                { expiresIn: "30d" }
            );
            return res.json({ success: true, user: user, token: token });
        })
        .catch((err) => {
            const errorCode = err.code;
            const errorMessage = err.message;
            console.log(errorCode);
            console.log(errorMessage);
            return res.json({
                success: false,
                error: errorCode,
                message: errorMessage,
            });
        });
});

router.get("/logout", (req, res) => {
    signOut(firebaseAuth)
        .then(() => {
            res.redirect("/login");
        })
        .catch((err) => {
            console.log("Error!" + err);
        });
});

router.get("/meditation", (req, res) => {
    // if (firebaseAuth.currentUser) {
    res.sendFile(path.join(__dirname, "..", "public", "meditationTimer.html"));
    // } else {
    //     return res.redirect("/login");
    // }
});

router.get("/journal", (req, res) => {
    // if (firebaseAuth.currentUser) {
    res.sendFile(path.join(__dirname, "..", "public", "journal.html"));
    // } else {
    //     return res.redirect("/login");
    // }
});

router.get("/journalEditor", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "journalEntry.html"));
});

router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "habitTracker.html"));
});

module.exports = router;
