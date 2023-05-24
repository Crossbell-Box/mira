import { ethers } from "ethers";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const indexerRouter = createTRPCRouter({
	pendingRequestWithdrawalCount: publicProcedure
		.input(z.object({ recipient: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			let { recipient } = input;

			if (!recipient) return 0;

			recipient = ethers.utils.getAddress(recipient); // normalize

			const count = await ctx.prisma.request_withdrawal.count({
				where: { recipient_address: recipient, status: "pending" },
			});
			return count;
		}),

	pendingRequestDepositCount: publicProcedure
		.input(z.object({ recipient: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			let { recipient } = input;

			if (!recipient) return 0;

			recipient = ethers.utils.getAddress(recipient); // normalize

			const count = await ctx.prisma.request_deposit.count({
				where: { recipient_address: recipient, status: "pending" },
			});
			return count;
		}),

	withdrawals: publicProcedure
		.input(
			z.object({
				recipient: z.string().optional(),
				limit: z.number().optional().default(10),
				cursor: z.string().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			let { recipient, limit, cursor } = input;

			if (!recipient) return { list: [], nextCursor: undefined, total: 0 };

			recipient = ethers.utils.getAddress(recipient); // normalize

			const [list, total] = await Promise.all([
				ctx.prisma.request_withdrawal.findMany({
					where: { recipient_address: recipient },
					orderBy: { id: "desc" },
					take: limit + 1,
					cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
				}),
				ctx.prisma.request_withdrawal.count({
					where: { recipient_address: recipient },
				}),
			]);

			let nextCursor: string | undefined = undefined;
			if (list.length > limit) {
				const nextItem = list.pop();
				nextCursor = nextItem!.id.toString();
			}

			return {
				list,
				nextCursor,
				total,
			};
		}),

	deposits: publicProcedure
		.input(
			z.object({
				recipient: z.string().optional(),
				limit: z.number().optional().default(10),
				cursor: z.string().optional(),
			})
		)
		.query(async ({ ctx, input }) => {
			let { recipient, limit, cursor } = input;

			if (!recipient) return { list: [], nextCursor: undefined, total: 0 };

			recipient = ethers.utils.getAddress(recipient); // normalize

			const [list, total] = await Promise.all([
				ctx.prisma.request_deposit.findMany({
					where: { recipient_address: recipient },
					orderBy: { id: "desc" },
					take: limit + 1,
					cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
				}),
				ctx.prisma.request_deposit.count({
					where: { recipient_address: recipient },
				}),
			]);

			let nextCursor: string | undefined = undefined;
			if (list.length > limit) {
				const nextItem = list.pop();
				nextCursor = nextItem!.id.toString();
			}

			return {
				list,
				nextCursor,
				total,
			};
		}),
});
