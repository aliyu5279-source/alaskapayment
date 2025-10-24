import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
export default function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSignup(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error)
            setError(error.message);
        else
            alert("✅ Signup successful! Check your email to verify your account.");
    }
    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error)
            setError(error.message);
        else
            alert("✅ Logged in successfully!");
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700", children: _jsxs("div", { className: "bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center", children: [_jsx("h1", { className: "text-2xl font-bold mb-4 text-gray-800", children: "Sign In / Sign Up" }), _jsxs("form", { className: "space-y-3", children: [_jsx("input", { type: "email", placeholder: "Email", className: "w-full p-3 border rounded-lg", value: email, onChange: (e) => setEmail(e.target.value) }), _jsx("input", { type: "password", placeholder: "Password", className: "w-full p-3 border rounded-lg", value: password, onChange: (e) => setPassword(e.target.value) }), error && _jsx("p", { className: "text-red-500 text-sm", children: error }), _jsx("button", { onClick: handleSignup, disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg", children: loading ? "Processing..." : "Sign Up" }), _jsx("button", { onClick: handleLogin, disabled: loading, className: "w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg", children: loading ? "Processing..." : "Sign In" })] })] }) }));
}
