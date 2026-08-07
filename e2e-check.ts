import { createClient } from "@supabase/supabase-js";
import { buildContentProof, type VerifiableType } from "@/lib/blockchain/content";

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const sb = createClient(url, key);

const run = async () => {
  const out: string[] = [];
  const check = async (type: VerifiableType, label: string, entity: Record<string, unknown>) => {
    try {
      const a = await buildContentProof(type, entity);
      const b = await buildContentProof(type, entity);
      out.push(`${a.hash === b.hash ? "OK  " : "MISMATCH"} ${type.padEnd(11)} ${label.slice(0,42).padEnd(44)} ${a.source.padEnd(8)} ${a.hash.slice(0,16)}`);
    } catch (e) {
      out.push(`FAIL     ${type.padEnd(11)} ${label.slice(0,42).padEnd(44)} ${(e as Error).message}`);
    }
  };

  const { data: hero } = await sb.from("site_content").select("value").eq("section","hero").eq("key","resume_url").maybeSingle();
  if (hero?.value) await check("resume","Resume document",{ id:"resume", url: hero.value });
  else out.push("SKIP     resume      no resume_url configured");

  for (const [table, type, name] of [["certifications","certificate","title"],["achievements","achievement","title"],["projects","project","title"],["internships","internship","role"]] as const) {
    const { data } = await sb.from(table).select("*");
    for (const row of data ?? []) await check(type as VerifiableType, String((row as any)[name] ?? ""), row as any);
  }
  await check("ownership","Portfolio ownership claim",{ portfolio_id:"PREVIEW", owner:"Bollepalli Vamsi", owner_wallet:null, network:"polygon-amoy" });
  console.log(out.join("\n"));
};
run();
