import axios from "axios";
import { API_URL, USER_ID } from "../socket";

export async function storeExpense(expenseData) {
  const response = await axios.post(`${API_URL}/expenses`, {
    userId: USER_ID,
    title: expenseData.title,
    amount: Number(expenseData.price),
    date: expenseData.date,
    type: expenseData.type,
    recurring: Boolean(expenseData.recurring),
    kind: expenseData.kind || "expense",
  });

  return response.data.data.id;
}

export async function fetchExpensesFromFirebase() {
  const response = await axios.get(`${API_URL}/expenses/${USER_ID}`);

  return response.data.data.map((expense) => ({
    id: expense.id,
    title: expense.title,
    price: Number(expense.amount),
    date: expense.date,
    type: expense.type || "Food",
    recurring: Boolean(expense.recurring),
    kind: expense.kind || "expense",
  }));
}

export async function updateExpense(id, expenseData) {
  await axios.put(`${API_URL}/expenses/${USER_ID}/${id}`, {
    title: expenseData.title,
    amount: Number(expenseData.price),
    date: expenseData.date,
    type: expenseData.type,
    recurring: Boolean(expenseData.recurring),
    kind: expenseData.kind || "expense",
  });
}

export async function deleteExpense(id) {
  await axios.delete(`${API_URL}/expenses/${USER_ID}/${id}`);
}

export async function fetchFoodPicFromAPIHub() {
  try {
    const response = await fetch("https://foodish-api.com/api");

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();

    return data.image;
  } catch (error) {
    console.log("API error:", error);
    return null;
  }
}
