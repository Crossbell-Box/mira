import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const indexerRouter = createTRPCRouter({
	requestWithdrawalInfo: publicProcedure
		.input(z.object({ transactionHash: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			const res = await ctx.prisma.request_withdrawal.findFirst({
				where: { transaction: input.transactionHash },
			});
			return res;
		}),
});
