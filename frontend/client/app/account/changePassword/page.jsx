"use client";
import PasswordInput from "@components/Input/PasswordInput";
import Divider from "@components/UI/Divider";
import { useSession } from "@node_modules/next-auth/react";
import { patchAccount } from "@service/account";
import { toastError, toastSuccess, toastWarning } from "@util/toaster";
import React, { useState } from "react";

const ChangePassword = () => {
  const {data:session} = useSession()
  const [password,setPassword] = useState({
    current_password:'',
    new_password:'',
    repeat_password:'',
  })

  const checkEmptyInput = () => {
    if (
      !password.current_password.trim() ||
      !password.new_password.trim() ||
      !password.repeat_password.trim() 
    ) {
      toastWarning("Please fill out all field");
      return true;
    } 
    return false;
  };

  const validateNewPassword = () => {
    if(password.new_password.trim()!==password.repeat_password.trim()) {
      toastWarning("New passwords don't match")
      return false
    } else if (password.new_password.trim().length<8) {
      toastWarning("New password must be at least 8 letters long")
      return false
    } 
    return true
  }

  const handleChangePassword = () => {
    if(checkEmptyInput()) return
    if(!validateNewPassword()) return
    patchAccount(password).then(data=>data?toastSuccess('Password updated'):toastError('Failed to update password'))
  }
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
            <PasswordInput value={password.current_password} onChange={(t)=>setPassword(p=>({...p,current_password:t}))}/>
            <span>
              <h2>New password</h2>
            </span>
            <PasswordInput value={password.new_password} onChange={(t)=>setPassword(p=>({...p,new_password:t}))}/>
            <span>
              <h2>Repeat password</h2>
            </span>
            <PasswordInput value={password.repeat_password} onChange={(t)=>setPassword(p=>({...p,repeat_password:t}))}/>
            <button className="button-variant-1  md:col-span-2" onClick={handleChangePassword}>Change password</button>
          </div>
      </div>
    </section>
  );
};

export default ChangePassword;
