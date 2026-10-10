const express = require("express");
const http = require("http");
const cors = require("cors");
const admin = require("firebase-admin");
const { Server } = require("socket.io");
require("dotenv").config();

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.database();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {});
});

function getCurrentMonthKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

app.post("/budget", async (req, res) => {
  try {
    const { userId, monthlyBudget, categoryBudgets } = req.body;

    if (!userId || monthlyBudget === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId and monthlyBudget are required",
      });
    }

    await db.ref(`budgets/${userId}`).set({
      monthlyBudget: Number(monthlyBudget),
      categoryBudgets: categoryBudgets || {},
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      message: "Budget saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/budget/:userId", async (req, res) => {
  try {
    const snapshot = await db.ref(`budgets/${req.params.userId}`).once("value");
    res.status(200).json({ success: true, data: snapshot.val() || { monthlyBudget: 0, categoryBudgets: {} } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/expenses", async (req, res) => {
    //console.log
     console.log("POST /expenses received");
     console.log(req.body);
  try {
    const { userId, title, amount, date, type, recurring, kind } = req.body;

    if (!userId || !title || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, title and amount are required",
      });
    }

    const expenseDate = date ? new Date(date) : new Date();
    const monthKey = getCurrentMonthKey(expenseDate);

    const expenseRef = db.ref(`expenses/${userId}`).push();

    const expense = {
      id: expenseRef.key,
      title,
      amount: Number(amount),
      date: expenseDate.toISOString(),
      type: type || "Food",
      recurring: Boolean(recurring),
      kind: kind || "expense",
      monthKey,
      createdAt: new Date().toISOString(),
    };

    await expenseRef.set(expense);

    const budgetSnapshot = await db.ref(`budgets/${userId}`).once("value");
    const budgetData = budgetSnapshot.val();

    if (budgetData && Number(budgetData.monthlyBudget) > 0) {
      const expensesSnapshot = await db
        .ref(`expenses/${userId}`)
        .orderByChild("monthKey")
        .equalTo(monthKey)
        .once("value");

      let monthlyTotal = 0;

      expensesSnapshot.forEach((child) => {
        const item = child.val();
        if (item.kind !== "income") monthlyTotal += Number(item.amount || 0);
      });

      const monthlyBudget = Number(budgetData.monthlyBudget);

      if (monthlyTotal > monthlyBudget) {
        const notificationRef = db.ref(`notifications/${userId}`).push();

        const notification = {
          id: notificationRef.key,
          title: "Monthly Budget Exceeded",
          message: `Your monthly spending is RM ${monthlyTotal.toFixed(
            2
          )}, which exceeds your budget of RM ${monthlyBudget.toFixed(2)}.`,
          type: "budget",
          isRead: false,
          createdAt: new Date().toISOString(),
        };

        await notificationRef.set(notification);

        io.to(userId).emit("budgetExceeded", notification);
      }
    }

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.ref(`expenses/${userId}`).once("value");
    const data = snapshot.val() || {};

    const expenses = Object.values(data).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      data: expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



app.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.ref(`notifications/${userId}`).once("value");
    const data = snapshot.val() || {};

    const notifications = Object.values(data).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/expenses/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;
    const { title, amount, date, type, recurring, kind } = req.body;

    const expenseDate = date ? new Date(date) : new Date();
    const monthKey = getCurrentMonthKey(expenseDate);

    const updatedExpense = {
      id: expenseId,
      title,
      amount: Number(amount),
      date: expenseDate.toISOString(),
      type: type || "Food",
      recurring: Boolean(recurring),
      kind: kind || "expense",
      monthKey,
      updatedAt: new Date().toISOString(),
    };

    await db.ref(`expenses/${userId}/${expenseId}`).update(updatedExpense);

    res.status(200).json({
      success: true,
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});





app.put("/notifications/:userId/:notificationId/read", async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    await db.ref(`notifications/${userId}/${notificationId}`).update({
      isRead: true,
    });

    const snapshot = await db
      .ref(`notifications/${userId}/${notificationId}`)
      .once("value");

    res.status(200).json({
      success: true,
      data: snapshot.val(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/expenses/:userId/:expenseId", async (req, res) => {
  try {
    const { userId, expenseId } = req.params;

    await db.ref(`expenses/${userId}/${expenseId}`).remove();

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});



app.delete("/notifications/:userId/:notificationId", async (req, res) => {
  try {
    const { userId, notificationId } = req.params;

    await db.ref(`notifications/${userId}/${notificationId}`).remove();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
