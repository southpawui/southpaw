import { redirect } from "next/navigation";

// The landing page comes later; the docs are the site for now.
export default function Home() {
  redirect("/docs");
}
