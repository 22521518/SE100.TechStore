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
          customer: session?.user.customer,
          isAuthenticated: true,
        })
      );
      dispatch(
        setCart({
          customerId: session.user.customer?.customer_id,
          cart: [...session.user.cart||[]],
        })
      );
    }
  }, [session, status]);
}
