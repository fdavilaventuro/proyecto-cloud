import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const API_BASE = "https://hvleepsc4d.execute-api.us-east-1.amazonaws.com/dev";

export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
};

export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
};

export const removeToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
    }
};

export const getUserName = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userName");
    }
    return null;
};

export const setUserName = (name: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("userName", name);
    }
};

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Optional: Redirect to login or handle unauthorized access
        removeToken();
        // window.location.href = "/login"; 
    }

    return response;
}
