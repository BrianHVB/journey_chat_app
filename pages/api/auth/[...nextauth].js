import NextAuth from "next-auth";
import Providers from "next-auth/providers";


export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  secret: process.env['JWT_SECRET'],

  jwt: {
    secret: process.env['JWT_SECRET'],
  },

  callbacks: {
    session: async (session, user) => {
      session.id = user.id;
      console.dir({session, user});
      return session;
    },
  },
});