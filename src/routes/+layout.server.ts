import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, url, cookies }) => {
  const res = await fetch("/api/auth/check", {
    method: "POST",
    credentials: "include",
  });

  const publicRoutes = ["/login", "/"];
  const isPublic = publicRoutes.includes(url.pathname);

  if (!res.ok && !isPublic) redirect(303, "/login");

  return { authed: res.ok };
};
