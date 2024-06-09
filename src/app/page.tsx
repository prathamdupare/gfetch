"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const page = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    if (session?.access_token && messages.length === 0) {
      fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMessages(data.messages);
          fetchEmails(data.messages);
        })
        .catch((error) => {
          console.error("Error fetching Gmail messages:", error);
        });
    }
  }, [session, messages]);

  const fetchEmails = (messages) => {
    const emailPromises = messages.map((message) =>
      fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            Accept: "application/json",
          },
        },
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error fetching email details for ${message.id}: ${response.status} - ${response.statusText}`,
          );
        }
        return response.json();
      }),
    );

    Promise.all(emailPromises)
      .then((emailData) => {
        setEmails(emailData);
        console.log(emailData); // Log email data
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
      });
  };

  console.log(session?.access_token);
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div>
        {session ? (
          <div className="flex items-center gap-2">
            Signed in as {session.user.email} <br />
            <Button onClick={() => signOut()}>Sign out</Button>{" "}
          </div>
        ) : (
          <div>
            Not signed in <br />{" "}
            <Button onClick={() => signIn()}>Sign in</Button>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
