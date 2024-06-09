"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [emails, setEmails] = useState([]);
  const [emailsData, setEmailsData] = useState([]);
  const [classifiedEmail, setClassifiedEmail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmails, setSelectedEmails] = useState(10);

  useEffect(() => {
    console.log(emailsData);
  }, [emailsData]);
  useEffect(() => {
    const fetchGmailMessages = async () => {
      try {
        if (session?.access_token && messages.length === 0) {
          const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${selectedEmails}`,
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

        const responseData = JSON.parse(data.output);

        console.log(
          "=================THE response data is========",
          responseData,
        );
        // Access the emailsData array
        const mainData = responseData.emailsData;

        console.log("=================THE emails data is========", mainData);

        setClassifiedEmail(mainData);
        setLoading(false);
      } catch (error) {
        console.error("Error sending emailsData to API:", error);
      }
    };

    if (session?.access_token && emailsData.length > 0) {
      sendEmailsDataToApi();
    }

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

    fetchGmailMessages();
  }, [session, selectedEmails, emailsData, messages]);

  console.log(session?.access_token);
  return (
    <div className="h-screen w-screen flex  flex-row mx-10  gap-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Mails to Classify" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={10} onClick={() => setSelectedEmails(10)}>
            10
          </SelectItem>
          <SelectItem value={15} onClick={() => setSelectedEmails(15)}>
            15
          </SelectItem>
          <SelectItem value={20} onClick={() => setSelectedEmails(20)}>
            20
          </SelectItem>
        </SelectContent>
      </Select>

      <Tabs
        defaultValue="account"
        className="flex mx-20 justify-center flex-col"
      >
        <TabsList className="w-[200px]">
          <TabsTrigger value="account">Normal Mode</TabsTrigger>
          <TabsTrigger value="password">Classify</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="">
            <ScrollArea className="h-[800px] w-[750px] rounded-md border p-4">
              {emailsData &&
                emailsData.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Card key={email.id}>
                      <CardHeader>
                        <CardTitle>{email.snippet}</CardTitle>
                        <CardDescription>{email.id}</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <p> {email.classification} </p>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div>
            {loading ? (
              <div className="h-[800px] w-[750px] rounded-md border p-4">
                Please wait classifying emails...
              </div>
            ) : (
              <div className="">
                <ScrollArea className="h-[800px] w-[750px] rounded-md border p-4">
                  {classifiedEmail &&
                    classifiedEmail.map((email) => (
                      <Card key={email.id}>
                        <CardHeader>
                          <CardTitle>{email.snippet}</CardTitle>
                          <CardDescription>
                            {email.classification}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <p> {email.classification} </p>
                        </CardFooter>
                      </Card>
                    ))}
                </ScrollArea>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
