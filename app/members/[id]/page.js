// app/members/[id]/page.js
import MemberProfile from "./profile-client";

export default async function Page({ params }) {
  const { id } = await params; // unwrapped Promise
  return <MemberProfile id={id} />;
}
