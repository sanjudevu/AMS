import Link from "next/link";
import React from "react";

import { signIn, signOut, useSession } from "next-auth/react";

import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";
import Loading from "~/components/Loading";
import { Button } from "~/components/nextui/Button";
import { api } from "~/utils/api";

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const allData = api.example.getAll.useQuery();
  console.log(allData.data);

  const session = useSession();

  if (session.status === "loading") {
    return <Loading />
  }

  const isAuthed = session.status === "authenticated";

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <AuthButton isAuthed={isAuthed}/>

          <Link href="/employee">
            <Button color="primary" size="md" endContent={<BsEyeFill size={18}/>}>
              Go to employee Details
            </Button>
          </Link>
        </div>
      </main>
  );
}


const AuthButton = ({isAuthed}:{isAuthed: boolean})=>{
  return(
    isAuthed ?
      <Button color="warning" endContent={<IoMdLogIn size={16} />} onClick={() => { void signOut({ callbackUrl: "/auth/signout" }) }}>
        Sign Out
      </Button>
      :
      <Button color="success" endContent={<IoMdLogOut size={16} />} onClick={() => { void signIn() }} >
        Sign In
      </Button>
    
  )
}