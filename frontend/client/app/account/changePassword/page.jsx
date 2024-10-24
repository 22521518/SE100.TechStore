"use client";
import PasswordInput from "@components/Input/PasswordInput";
import Divider from "@components/UI/Divider";
import React from "react";

const ChangePassword = () => {
  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="text-xl font-semibold">Change password</div>
        <div className="text-sm opacity-60">Change your account password</div>
      </div>
      <Divider />
      <div className="flex justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-4 whitespace-nowrap w-fit h-fit">
            <span>
              <h2>Current password</h2>
            </span>
            <PasswordInput/>
            <span>
              <h2>New password</h2>
            </span>
            <PasswordInput/>
            <span>
              <h2>Repeat password</h2>
            </span>
            <PasswordInput/>
            <button className="button-variant-1  md:col-span-2">Change password</button>
          </div>
      </div>
    </section>
  );
};

export default ChangePassword;
