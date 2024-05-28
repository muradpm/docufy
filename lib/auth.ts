import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { siteConfig } from "@/config/site";
import prisma from "@/prisma/client";
import type { Role } from "@prisma/client";
import { Client } from "postmark";
import { env } from "@/env.mjs";

const postmarkClient = new Client(env.POSTMARK_API_TOKEN);

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      stripeIsActive: boolean;
      role: Role;
      // ...other properties
    } & DefaultSession["user"];
  }

  interface User {
    stripeIsActive: boolean;
    role: Role;
    //   // ...other properties
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          stripeIsActive: user.stripeIsActive,
          role: user.role,
        },
      };
    },
    async jwt({ token, user }) {
      const invitedUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!invitedUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: invitedUser.id,
        name: invitedUser.name,
        email: invitedUser.email,
        picture: invitedUser.image,
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  events: {
    createUser: async ({ user }) => {
      try {
        // Check if the user already has a workspace
        const existingWorkspace = await prisma.workspace.findFirst({
          where: {
            userId: user.id,
          },
        });

        // If not, create a new workspace for the user
        if (!existingWorkspace) {
          await prisma.workspace.create({
            data: {
              name: "Personal",
              userId: user.id,
            },
          });
        }
      } catch (error) {
        console.error("Error creating workspace for user:", error);
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      from: env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const user = await prisma.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        });

        const templateId = user?.emailVerified
          ? env.POSTMARK_LOG_IN_TEMPLATE
          : env.POSTMARK_ACTIVATION_TEMPLATE;
        if (!templateId) {
          throw new Error("Missing template id");
        }

        const result = await postmarkClient.sendEmailWithTemplate({
          TemplateId: parseInt(templateId),
          To: identifier,
          From: provider.from,
          TemplateModel: {
            action_url: url,
            product_name: siteConfig.name,
          },
          Headers: [
            {
              // Set this to prevent Gmail from threading emails.
              // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
              Name: "X-Entity-Ref-ID",
              Value: new Date().getTime() + "",
            },
          ],
        });

        if (result.ErrorCode) {
          throw new Error(result.Message);
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
