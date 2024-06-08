"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  return (
    <div className="w-full fixed shadow bg-background border-b flex items-center justify-between px-3 shadow mb-2 py-2 ">
      <div className="text-[25px]">
        <a
          href="https://codex.fosspage.com/"
          className="text-primary font-bold"
        >
          G<span className="text-green-400 font-bold">Fetch</span>
        </a>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Button>
          <Link href="/">Dashboard</Link>
        </Button>

        <ModeToggle />

        <div>{session?.user?.email}</div>
      </div>
    </div>
  );
};

export default Navbar;
