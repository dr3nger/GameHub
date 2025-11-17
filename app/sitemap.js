import { supabase } from "@/utils/supabaseClient";

export default async function sitemap() {
  const domain = "https://porn4games.vercel.app";

  const { data: games } = await supabase
    .from("games")
    .select("id, created_at");

  const routes = [
    {
      url: domain,
      lastModified: new Date().toISOString(),
      priority: 1.0,
    }
  ];

  games?.forEach((game) => {
    routes.push({
      url: `${domain}/game/${game.id}`,
      lastModified: new Date(game.created_at).toISOString(),
      priority: 0.8,
    });
  });

  return routes;
}
