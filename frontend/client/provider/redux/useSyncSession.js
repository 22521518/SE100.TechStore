"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setSession, clearSession } from "./session/sessionSlice";
import { setCart } from "./cart/cartSlice"; 

export default function useSyncSession() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch(
        setSession({
          user: session?.user,
          isAuthenticated:true,
        })
      );
      dispatch(
        setCart({
            cart:[...session.user.cart]
        })
      )
    } 
  }, [session, status, dispatch]);
}
