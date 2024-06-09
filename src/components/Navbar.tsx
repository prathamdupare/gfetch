"use client";
import { Button } from "./ui/button";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full fixed shadow bg-background border-b flex items-center justify-between px-3 shadow mb-2 py-2 ">
      <div className="flex items-center gap-3">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-10" />
        </Link>

        <Link href="/mails">
          <Button>Go to Mails</Button>
        </Link>
      </div>
      <div>
        {session ? (
          <div className="flex items-center gap-2">
            Signed in as {session.user.email} <br />{" "}
            <Button onClick={() => signOut()}>Sign out</Button>{" "}
          </div>
        ) : (
          <div>
            Not signed in <br />{" "}
            <Button onClick={() => signIn()}>Sign in</Button>{" "}
          </div>
        )}
      </div>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
