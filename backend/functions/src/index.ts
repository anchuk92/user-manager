import * as functions from "firebase-functions";
import { initializeApp} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import express from "express";
import cors from "cors";

initializeApp();
const db = getFirestore();
const USERS_COLLECTION = "users";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

interface UserData {
  id?: number
  name: string;
  role: string;
  isActive: boolean
  createdAt: Date;
}

// GET /users
app.get("/users", async (req, res) => {
  try {
    const search = (req.query.search as string | undefined)?.toLowerCase();

    if (!search) {
      // Return all users if no search is provided
      const snapshot = await db.collection(USERS_COLLECTION).get();
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(allUsers);
      return;
    }

    const getPrefixEnd = (prefix: string) =>
        prefix.slice(0, -1) + String.fromCharCode(prefix.charCodeAt(prefix.length - 1) + 1);
    const end = getPrefixEnd(search);

    // Perform two separate queries: one for name, one for email
    const nameQuerySnap = await db.collection(USERS_COLLECTION).where("name", ">=", search).where("name", "<", end).get();
    const roleQuerySnap = await db.collection(USERS_COLLECTION).where("role", ">=", search).where("role", "<", end).get();

    // Merge results and remove duplicates
    const resultsMap = new Map<string, any>();
    nameQuerySnap.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    roleQuerySnap.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));

    const combinedResults = Array.from(resultsMap.values());

    res.status(200).json(combinedResults);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// GET /users/:id
app.get("/users/:id", async (req, res) => {
    const doc = await db.collection(USERS_COLLECTION).doc(req.params.id).get();
    if (!doc.exists) res.status(404).send("User not found");

    res.status(200).json({ id: doc.id, ...doc.data() });
});

// POST /users
app.post("/users", async (req, res) => {
    const { name, role, isActive = false } = req.body as UserData;

    if(!name || !role) {
      res.status(400).send("Invalid user data");
      return;
    }

    const doc = await db.collection(USERS_COLLECTION).add({ name, role, isActive, createdAt: new Date() });
    res.status(201).json({ id: doc.id });
});

// PUT /users/:id
app.put("/users/:id", async (req, res) => {
  const { name, role, isActive = false } = req.body as UserData;

  if(!name || !role) {
    res.status(400).send("Invalid user data");
    return;
  }

  const doc = db.collection("users").doc(req.params.id);
  await doc.set({ name, role, isActive }, { merge: true });
  res.status(200).json({ id: req.params.id });
});

// PATCH /users/:id
app.patch("/users/:id", async (req, res) => {
  try {
    const docRef = db.collection('users').doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const currentData = docSnap.data();
    if (!currentData) {
      res.status(404).json({ error: 'User data not found' });
      return;
    }
    const newStatus = !currentData.isActive;

    await docRef.set({ isActive: newStatus }, { merge: true });

    res.status(200).json({ id: req.params.id, isActive: newStatus });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  await db.collection(USERS_COLLECTION).doc(req.params.id).delete();
  res.status(204).send();
});

export const api = functions.https.onRequest(app);
