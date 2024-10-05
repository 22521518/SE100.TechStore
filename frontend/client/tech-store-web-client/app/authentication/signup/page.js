import React from 'react'
import InputBox from '@components/Input/InputBox'
import Link from 'next/link'
import DatePicker from '@components/Input/DatePicker'
import RadioButton from '@components/Input/RadioButton'
import PasswordInput from '@components/Input/PasswordInput'
import PhoneInput from '@components/Input/PhoneInput'

export default function SignUp() {

  return (
    <div className="flex items-center justify-center">
    <form className="max-w-[800px] w-full bg-surface py-8 px-8 flex flex-col gap-14 shadow-lg">
      <h1 className="text-5xl font-bold text-right">Sign up</h1>

      <div className='flex flex-col gap-10 bg-inherit'>
          <div className='flex md:flex-row flex-col gap-10 bg-inherit'>
              <InputBox name={"first name"}/>
              <InputBox name={"last name"}/>
          </div>
          <div className='flex md:flex-row flex-col gap-10 bg-inherit'>
                <RadioButton options={['Male' ,'Female']}/>
              <DatePicker name={"birth date"}/>
          </div>
          <InputBox name={"username"}/>
          <PhoneInput name={"phone number"}/>
          <InputBox name={"email"}/>
          <PasswordInput name={"password"}/>
          <PasswordInput name={"repeat password"}/>
      </div>
      <button className="button-variant-1 text-2xl">Sign up</button>
      <p className="text-center text-on-surface text-xl">
        Don't have an account?{" "}
        <Link href="/authentication/login" className="underline font-bold">
          Log in
        </Link>
      </p>


    </form>
  </div>
  )
}
