import { describe, expect, it } from "vitest";
import { drawTeams, type DrawPlayer } from "./team-draw";

const mk = (i: number, gk = false, star = false): DrawPlayer => ({
  id: String(i), name: `P${i}`, is_goalkeeper: gk, is_star: star,
});

describe("drawTeams equilibrado", () => {
  const players = [mk(1, true), mk(2, true), mk(3, false, true), mk(4, false, true),
    mk(5), mk(6), mk(7), mk(8), mk(9), mk(10)];

  it("coloca 1 goleiro por time", () => {
    const teams = drawTeams(players, 2, "equilibrado");
    for (const t of teams) expect(t.players.filter((p) => p.is_goalkeeper)).toHaveLength(1);
  });

  it("distribui os bons de bola entre os times", () => {
    const teams = drawTeams(players, 2, "equilibrado");
    for (const t of teams) expect(t.players.filter((p) => p.is_star)).toHaveLength(1);
  });

  it("times ficam com tamanho igual e todos sorteados", () => {
    const teams = drawTeams(players, 2, "equilibrado");
    expect(teams.map((t) => t.players.length)).toEqual([5, 5]);
  });
});

describe("drawTeams aleatorio", () => {
  it("distribui todos os jogadores", () => {
    const teams = drawTeams([mk(1), mk(2), mk(3), mk(4), mk(5)], 2, "aleatorio");
    expect(teams.flatMap((t) => t.players)).toHaveLength(5);
  });
});
