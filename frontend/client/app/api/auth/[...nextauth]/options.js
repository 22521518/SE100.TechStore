import { login } from "@service/account";
import { getCustomer } from "@service/customer";
import { generateDummyCart } from "@util/generator/cart";
import { randomImage } from "@util/generator/customer";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";  // Importing jwt for decoding the token
import { getCart } from "@service/cart";


export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "email...",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password...",
        },
      },
      async authorize(credentials, req) {
        console.log("Credentials provided:", credentials);

        const data = await login({
          email: credentials.email,
          password: credentials.password,
        });
  
        if (data && data.access_token) {
          // Decode the token to get user ID
          const decodedToken = jwt.decode(data.access_token);
          const userId = decodedToken?.id;
  
          if (!userId) {
            throw new Error("Invalid token");
          }
          return {
            id:userId, 
            accessToken: data.access_token,
            expiresIn: data.expires_in,
          };
        }
  
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/authentication/login", // Use your custom sign-in page
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.expiresIn = token.expiresIn;
        session.user.customer = await getCustomer(token.id);
        session.user.cart = await getCart(token.id)
      }
      return session;
    },
    async jwt({ token, user }) {

      // Add user properties to the token when user logs in
      if (user) {
        token.accessToken = user.accessToken;
        token.expiresIn = user.expiresIn;
        // Store customer data in the token
        token.id = user.id;
      }
      return token;
    },
  },
};
