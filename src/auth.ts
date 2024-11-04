import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Discord],
  callbacks: {
    async jwt({ token, profile }) {
        if (profile) {
            token.id = profile.id;
        }
        
        return token;
    },

    async session({ session, token }) {
        // @ts-expect-error (id is added in the jwt callback)
        session.user.id = token.id;

        return session;
    },
  }
})