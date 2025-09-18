import axios from "axios";

const API_BASE = "https://68cc3ae2716562cf5076f055.mockapi.io/api/books/book";

// CRUD API Calls
export const getBooks = () => axios.get(API_BASE);
export const addBook = (data) => axios.post(API_BASE, data);
export const updateBook = (id, data) => axios.put(`${API_BASE}/${id}`, data);
export const deleteBook = (id) => axios.delete(`${API_BASE}/${id}`);
