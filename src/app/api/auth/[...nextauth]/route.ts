import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongoDB";
import { User } from "@/models/User";
import type { AuthOptions, User as NextAuthUser, Account, Profile, Session } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: NextAuthUser; account: Account | null; profile?: Profile }) {
      if (account?.provider === "google") {
        if (!profile) {
          return false;
        }
        try {
          await connectToDB();
          
          // Check if user exists
          const userExists = await User.findOne({ email: user.email });
          
          // If not, create a new user
          if (!userExists) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: (profile as any).sub, // Google's unique identifier
            });
          }
          
          return true;
        } catch (error) {
          console.log("Error checking if user exists: ", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }: { session: Session; token?: any }) {//This function runs on every request to maintain session data:
      try {
        await connectToDB();
        // Find user in database
        if (session.user) {
          const user = await User.findOne({ email: session.user.email });
        
          // Add user id to session
          if (user) {
            (session.user as any).id = user._id.toString();
          }
        }
        
        return session;
      } catch (error) {
        console.log("Error in session callback: ", error);
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };