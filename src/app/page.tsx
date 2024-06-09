"use client";

// Home.js

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Home = () => {
  const [apiKey, setApiKey] = useState("");

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSaveApiKey = () => {
    localStorage.setItem("OPENAI_API_KEY", apiKey);
    alert("API Key saved successfully!");
  };

  return (
    <div className="flex flex-col mx-10 gap-3">
      <h1>Enter OpenAI API Key</h1>
      <Input
        type="text"
        value={apiKey}
        onChange={handleApiKeyChange}
        placeholder="Enter your OpenAI API Key"
      />
      <Button onClick={handleSaveApiKey}>Save API Key</Button>
    </div>
  );
};

export default Home;
