export type DrawPlayer = { id: string; name: string; is_goalkeeper: boolean; is_star: boolean };
export type DrawMethod = "equilibrado" | "aleatorio";
export type Team = { name: string; players: DrawPlayer[] };

function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/**
 * equilibrado: 1 goleiro por time (enquanto houver), bons de bola espalhados,
 * demais completam o time com menos jogadores. aleatorio: tudo embaralhado.
 */
export function drawTeams(
  players: DrawPlayer[],
  teamsCount: number,
  method: DrawMethod,
  rand: () => number = Math.random,
): Team[] {
  const n = Math.max(2, Math.floor(teamsCount));
  const teams: Team[] = Array.from({ length: n }, (_, i) => ({ name: `Time ${i + 1}`, players: [] }));
  const smallest = () =>
    teams.reduce((min, t) => (t.players.length < min.players.length ? t : min), teams[0]!);

  if (method === "aleatorio") {
    shuffle(players, rand).forEach((p, i) => teams[i % n]!.players.push(p));
    return teams;
  }

  const gks = shuffle(players.filter((p) => p.is_goalkeeper), rand);
  const stars = shuffle(players.filter((p) => !p.is_goalkeeper && p.is_star), rand);
  const rest = shuffle(players.filter((p) => !p.is_goalkeeper && !p.is_star), rand);

  gks.slice(0, n).forEach((p, i) => teams[i]!.players.push(p));
  const extraGks = gks.slice(n);

  const starCount = (t: Team) => t.players.filter((p) => p.is_star && !p.is_goalkeeper).length;
  for (const s of stars) {
    const target = teams.reduce((best, t) =>
      starCount(t) < starCount(best) ||
      (starCount(t) === starCount(best) && t.players.length < best.players.length)
        ? t
        : best,
    );
    target.players.push(s);
  }
  for (const p of [...rest, ...extraGks]) smallest().players.push(p);
  return teams;
}
