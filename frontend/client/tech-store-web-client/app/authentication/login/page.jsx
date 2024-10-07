
import InputBox from "@components/Input/InputBox";
import PasswordInput from "@components/Input/PasswordInput";
import { faFacebook, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

export default function Login() {
  return (
    <div className="flex items-center justify-center">
      <form className="max-w-[800px] w-full bg-surface py-8 px-8 flex flex-col gap-14 shadow-lg">
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

        <div className="flex items-center gap-2">
          <div className="flex-grow border-t border-on-surface/50"></div>
          <span className="text-on-surface/50 text-xl">Or log in with</span>
          <div className="flex-grow border-t border-on-surface/50"></div>
        </div>

        <ul className="flex flex-wrap gap-x-2   gap-y-2">
            <button className="basis-1/3 grow button-variant-1 text-lg">
            <FontAwesomeIcon icon={faGoogle}/>
            Google
            </button>
            <button className="basis-1/3 grow button-variant-1 text-lg">
            <FontAwesomeIcon icon={faGithub}/>
            Github
            </button>
            <button className="basis-1/3 grow button-variant-1 text-lg">
            <FontAwesomeIcon icon={faFacebook}/>
            Facebook
            </button>
        </ul>
      </form>
    </div>
  );
}
