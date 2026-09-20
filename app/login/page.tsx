"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      if (data.exists) {
        // Registered user -> Navigate to Dashboard
        router.push(data.redirectTo || "/dashboard");
      } else {
        // Unregistered user -> Navigate to Registration
        router.push(data.redirectTo || "/apply-now");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 bg-white rounded-md shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {errorMsg}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium mb-1">
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Continue"}
        </button>
      </form>
    </div>
  );
}
