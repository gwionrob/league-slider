import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { updateLeague } from "../../../utils/updateLeague";

type FPLEvent = {
    id: number;
    finished: boolean;
};
type FPLResponse = {
    events: Array<FPLEvent>;
};

const gameweekCheck = async () => {
    return fetch(
        "https://fantasy.premierleague.com/api/bootstrap-static/",
    ).then((response) => {
        return response.json();
    });
};

export const leagueRouter = createTRPCRouter({
    getLeague: publicProcedure
        .input(z.object({ season: z.string(), gameweek: z.number() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.league_standings.findMany({
                where: {
                    season: input.season,
                    gameweek: input.gameweek,
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
    getMaxGameweek: publicProcedure
        .input(z.object({ season: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.prisma.league_standings.aggregate({
                where: {
                    season: input.season,
                },
                _max: {
                    gameweek: true,
                },
            });
        }),
    getLeaguePosition: publicProcedure
        .input(z.object({ team: z.string(), gameweek: z.number() }))
        .query(({ ctx, input }) => {
            if (input.gameweek === 100) {
                return ctx.prisma.league_standings.findMany({
                    where: {
                        team: input.team,
                    },
                    distinct: ["season"],
                    orderBy: [
                        {
                            gameweek: "desc",
                        },
                        {
                            season: "asc",
                        },
                    ],
                    select: {
                        season: true,
                        position: true,
                    },
                });
            }
            return ctx.prisma.league_standings.findMany({
                where: {
                    team: input.team,
                    gameweek: input.gameweek,
                },
                distinct: ["season"],
                orderBy: [
                    {
                        gameweek: "desc",
                    },
                    {
                        season: "asc",
                    },
                ],
                select: {
                    season: true,
                    position: true,
                },
            });
        }),
    updateLeague: publicProcedure
        .input(z.object({ gameweek: z.number(), season: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const gameweekChecks = (await gameweekCheck()) as FPLResponse;
            const finishedGameweeks = gameweekChecks.events
                .filter((event: FPLEvent) => event.finished)
                .map((event: FPLEvent) => event.id);
            const maxGameweek = Math.max(...finishedGameweeks);
            if (maxGameweek > input.gameweek)
                await updateLeague(input.gameweek, input.season);
        }),
    getSeasons: publicProcedure.query(async ({ ctx }) => {
        const seasons = await ctx.prisma.league_standings.findMany({
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
        return seasons;
    }),
});
