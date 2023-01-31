import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const leagueRouter = createTRPCRouter({
    getLeague: publicProcedure
        .input(z.object({ season: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.league_standings.findMany({
                where: {
                    season: input.season,
                },
                orderBy: [
                    {
                        position: "asc",
                    },
                    {
                        goal_difference: "asc",
                    },
                    {
                        goals_for: "asc",
                    },
                ],
                select: {
                    gameweek: true,
                    position: true,
                    team: true,
                    points: true,
                    matches_played: true,
                    wins: true,
                    draws: true,
                    losses: true,
                    goals_for: true,
                    goals_against: true,
                    goal_difference: true,
                },
            });
        }),
    getGameweeks: publicProcedure
        .input(z.object({ season: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.league_standings.findMany({
                distinct: ["gameweek"],
                where: {
                    season: input.season,
                },
                orderBy: [
                    {
                        gameweek: "asc",
                    },
                ],
                select: {
                    gameweek: true,
                },
            });
        }),
    getSeasons: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.league_standings.findMany({
            distinct: ["season"],
            orderBy: [
                {
                    season: "asc",
                },
            ],
            select: {
                season: true,
            },
        });
    }),
});
