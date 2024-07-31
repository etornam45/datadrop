// place files you want to import through the `$lib` alias in this folder.

import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});