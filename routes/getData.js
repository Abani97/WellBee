const express = require("express");
const router = express.Router();
const { jwtHash } = require("./authMiddleware");
const jwt = require("jsonwebtoken");
const firebaseConfig = require("../public/config/firebase");
const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    setDoc,
    orderBy,
    limit,
} = require("firebase/firestore");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

router.post("/getJournal", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const journalsQuery = query(
            collection(db, "journals"),
            where("userId", "==", req.userId),
            orderBy("date")
        );
        const allJournals = await getDocs(journalsQuery);
        const current = [];
        allJournals.forEach((journal) => {
            const data = journal.data();
            const dateString = data.date;
            const parts = dateString.split(" ");
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const dateObject = new Date(year, month, day);

            current.push({
                id: journal.id,
                date: dateObject,
                mood: data.mood,
                title: data.title,
                html: data.htmlString,
            });
        });
        res.json({
            success: true,
            userId: req.userId,
            journals: current,
        });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/getSingleJournal", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const { journalId } = req.body;
        const docRef = doc(db, "journals", journalId);
        const docResponse = await getDoc(docRef);
        if (docResponse.exists()) {
            return res.json({ success: true, data: docResponse.data() });
        } else {
            return res.json({
                success: false,
                message: "invalidID",
                status: 404,
            });
        }
    } else {
        return res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/addJournal", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });

        const { journal, title, journalColor, type, mood, journalId } = req.body;
        let docId;
        if (type === "new") {
            docId = await addNewJournal(title, journal, journalColor, mood, req.userId);
        } else if (type === "edit") {
            docId = await updateJournal(journalId, title, journal, journalColor, mood);
        }

        res.json({
            success: true,
            id: docId,
        });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/getHabits", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const habitQuery = query(collection(db, "habits"), where("uid", "==", req.userId));
        const allHabits = await getDocs(habitQuery);
        const habitArr = [];
        allHabits.forEach((habit) => {
            const data = habit.data();
            habitArr.push({
                id: habit.id,
                name: data.name,
                timeRange: data.dayTime,
                isCompleted: data.isCompleted,
                lastUpdated: data.lastUpdated,
                desc: data.desc,
            });
        });
        res.json({ success: true, data: habitArr });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/addNewHabit", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const { name, desc, dayTime, isCompleted, lastUpdated } = req.body;
        const docId = addNewHabit(name, desc, dayTime, isCompleted, lastUpdated, req.userId);
        res.json({ success: true, id: docId });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/getMoods", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const journalsQuery = query(collection(db, "journals"), where("userId", "==", req.userId));
        const allJournals = await getDocs(journalsQuery);
        const moodArr = [];
        allJournals.forEach((journal) => {
            const data = journal.data();
            moodArr.push({
                date: new Date(data.date.seconds * 1000),
                mood: data.mood,
            });
        });
        res.json({ success: true, data: moodArr });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/setMeditationSession", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });

        const { seconds } = req.body;
        const dbCol = collection(db, "MeditationSession");
        await addDoc(dbCol, {
            seconds: seconds,
            date: serverTimestamp(),
            uid: req.userId,
        });

        res.json({ success: true });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

router.post("/getMeditationSessions", async (req, res) => {
    const token = req.cookies["token"];
    if (token) {
        jwt.verify(token, jwtHash, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });
            req.userId = decoded.userId;
        });
        const meditationQuery = query(
            collection(db, "MeditationSession"),
            where("uid", "==", req.userId),
            orderBy("date", "desc"),
            limit(10)
        );
        const allSessions = await getDocs(meditationQuery);
        const sessionsArr = [];
        allSessions.forEach((session) => {
            const data = session.data();
            sessionsArr.push({
                seconds: data.seconds,
                date: new Date(data.date.seconds * 1000),
            });
        });
        res.json({ success: true, data: sessionsArr });
    } else {
        res.json({ success: false, message: "invalidUser" });
    }
});

module.exports = router;

async function addNewJournal(title, journal, journalColor, mood, userId) {
    const dbCol = collection(db, "journals");
    const dateObject = new Date();
    const docRef = await addDoc(dbCol, {
        title: title,
        htmlString: journal,
        mood: mood,
        journalColor: journalColor,
        date:
            dateObject.getDate().toString().padStart(2, "0") +
            " " +
            (dateObject.getMonth() + 1).toString().padStart(2, "0") +
            " " +
            dateObject.getFullYear(),
        userId: userId,
    });
    return docRef.id;
}

async function updateJournal(journalID, title, journal, journalColor, mood) {
    const response = await setDoc(
        doc(db, "journals", journalID),
        {
            title: title,
            htmlString: journal,
            mood: mood,
            journalColor: journalColor,
        },
        { merge: true }
    );
    return response;
}

async function addNewHabit(name, desc, dayTime, isCompleted, lastUpdated, uid) {
    const dbCol = collection(db, "habits");
    const docRef = await addDoc(dbCol, {
        name: name,
        desc: desc,
        dayTime: dayTime,
        isCompleted: isCompleted,
        lastUpdated: lastUpdated,
        uid: uid,
    });
    return docRef.id;
}
