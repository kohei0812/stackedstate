"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // For displaying error messages
    const router = useRouter();

    function isError(err: unknown): err is Error {
        return err instanceof Error;
    }
    function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear any previous error message

        try {
            // Ensure CSRF cookie is set
            const csrfResponse = await fetch("https://stackedstate.com/sanctum/csrf-cookie", {
                method: "GET",
                credentials: "include", // Ensure cookies are sent
            });

            // Check if CSRF cookie request was successful
            if (!csrfResponse.ok) {
                setError("Failed to set CSRF cookie.");
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include", 
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the raw error response
                console.error('Error:', errorText);
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log(data);
            localStorage.setItem("token", data.access_token);
            router.push("/dashboard");
        } catch (err) {
            if (isError(err)) {
                console.error("Error:", err.message);
                setError(err.message); // Set the error message to display
            } else if (typeof err === "string") {
                console.error("Error:", err);
                setError(err);
            } else if (err instanceof Response) {
                const errorDetails = await err.json();
                console.error("Login failed with response:", errorDetails);
                setError(`Login failed: ${errorDetails.message || "Unknown error"}`);
            } else {
                console.error("Unknown error", err);
                setError("An unknown error occurred");
            }
        }
    };


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{ color: "red" }}>{error}</p>} {/* Display the error message */}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}
