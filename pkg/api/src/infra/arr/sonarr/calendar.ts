import { asApi } from '@zodios/core';
import { z } from 'zod';

const CalendarSchema = z.array(
  z.object({
    seriesId: z.number(),
    tvdbId: z.number(),
    episodeFileId: z.number(),
    seasonNumber: z.number(),
    episodeNumber: z.number(),
    title: z.string(),
    airDate: z.string(),
    airDateUtc: z.string(),
    runtime: z.number(),
    hasFile: z.boolean(),
    monitored: z.boolean(),
    grabbed: z.boolean(),
    unverifiedSceneNumbering: z.boolean(),
    id: z.number(),
  }),
);
export type Calendar = z.infer<typeof CalendarSchema>;

export const CalendarEndpoint = asApi([
  {
    method: 'get',
    path: '/api/v3/calendar',
    parameters: [
      {
        name: 'start',
        type: 'Query',
        schema: z.date().optional(),
      },
      {
        name: 'end',
        type: 'Query',
        schema: z.date().optional(),
      },
      {
        name: 'unmonitored',
        type: 'Query',
        schema: z.boolean().optional(),
      },
    ],
    response: CalendarSchema,
  },
]);
