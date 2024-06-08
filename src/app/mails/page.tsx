"use client";

import { useEffect, useState } from "react";

export default function MailsPage() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch(
          "/api/getMails?email=prathmeshdupare@gmail.com",
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setEmails(data.threads || []); // Adjust based on the actual response structure
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Emails</h1>
      <ul>
        {emails.map((email) => (
          <li key={email.id}>{email.snippet}</li> // Adjust based on the actual email structure
        ))}
      </ul>
    </div>
  );
}
