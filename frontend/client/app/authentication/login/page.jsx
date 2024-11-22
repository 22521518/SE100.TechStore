'use client'
import InputBox from "@components/Input/InputBox";
import PasswordInput from "@components/Input/PasswordInput";
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "@node_modules/next-auth/react";
import { redirect } from "@node_modules/next/dist/server/api-utils";
import Link from "next/link";
import React from "react";

export default function Login() {

  const handleSignIn = async (e)=> {
    e.preventDefault(); // Prevent the default form submission
    try {
      const result = await signIn("credentials", {
        email: 'john doe',
        password: '123',
        redirect: false, // Prevent automatic redirect
      });

      if (result?.error) {
        console.log(result.error); // Handle errors here
      } else {
        // Redirect to the desired page after successful sign-in
        window.location.href = '/'; // Adjust to your desired redirect URL
      }
    } catch (e) {
      console.log(e);
    }
    
  }
  return (
    <div className="flex items-center justify-center">
      <form className="max-w-[800px] w-full bg-surface py-8 px-8 flex flex-col gap-14 shadow-lg" onSubmit={(e)=>handleSignIn(e)}>
        <h1 className="text-5xl font-bold text-left">Login</h1>

        <div className='flex flex-col gap-10 bg-inherit'>
            <InputBox name={"username"}/>
            <PasswordInput name={"password"}/>
        </div>
        <button className="button-variant-1">Login</button>
        <p className="text-center text-on-surface text-xl">
          Don't have an account?{" "}
          <Link href="/authentication/signup" className="underline font-bold">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
