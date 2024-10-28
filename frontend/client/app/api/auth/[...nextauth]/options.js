import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";

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
        // Add logic here to look up the user from the credentials supplied
        const user = { id: "1", name: "John Doe", email: "jsmith@example.com",image:"https://franchisematch.com/wp-content/uploads/2015/02/john-doe.jpg" }
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null
  
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
  ],
  pages: {
    signIn: "/authentication/login", // Use your custom sign-in page
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async session({ session, token }) {
      // Attach user properties to the session
      if (token) {
        session.user.id = token.id; // Add user ID
        session.user.name = token.name; // Add user name
        session.user.image = token.image; // Add user image
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user properties to the token when user logs in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
  },
};
