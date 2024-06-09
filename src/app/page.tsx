"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);
  const [emailsData, setEmailsData] = useState([]);

  useEffect(() => {
    console.log(emailsData);
  }, [emailsData]);
  useEffect(() => {
    const fetchGmailMessages = async () => {
      try {
        if (session?.access_token && messages.length === 0) {
          const response = await fetch(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            },
          );
          const data = await response.json();
          console.log(data);
          setMessages(data.messages);
          fetchEmails(data.messages);
        }
      } catch (error) {
        console.error("Error fetching Gmail messages:", error);
      }
    };

    const sendEmailsDataToApi = async () => {
      try {
        const response = await fetch("/api/gpt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailsData }),
        });
        const data = await response.json();
        console.log("=================THE DATA IS========", data);
      } catch (error) {
        console.error("Error sending emailsData to API:", error);
      }
    };

    if (session?.access_token && emailsData.length > 0) {
      sendEmailsDataToApi();
    }

    fetchGmailMessages();
  }, [session]);

  const fetchEmails = async (messages) => {
    try {
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

      const emailData = await Promise.all(emailPromises);
      setEmails(emailData);
      const newEmailsData = emailData.map((email, index) => ({
        id: email.id,
        snippet: email.snippet,
        index: index + 1, // Adding index property to maintain the order
        classification: "",
      }));
      setEmailsData(newEmailsData);
      console.log(newEmailsData);
    } catch (error) {
      console.error("Error fetching email details:", error);
    }
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
      <div>
        {emails.map((email) => (
          <div key={email.id} className="bg-red-300">
            <p>Email id</p>
            <div>{email.id}</div>
            <p>Email Snippet</p>
            <div>{email.snippet}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
