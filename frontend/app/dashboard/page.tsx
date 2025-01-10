"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setMessage(data.message);
      } catch {
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{message}</p>
      <a href="/posts">Posts</a>
      <a href="/locations">Locations</a>
    </div>
  );
}
