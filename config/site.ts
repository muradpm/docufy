import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "docufy",
  description: "Empower your writing with intelligence.",
  url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  ogImage: `${process.env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    twitter: "https://twitter.com/docufyinc",
    linkedin: "https://linkedin.com/company/docufyinc/",
  },
};
