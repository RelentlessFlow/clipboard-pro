import {PrismaClient} from "@prisma/client";
import {ClipboardHistory} from "./clipboard";

interface IClipboardRepository {
	createClipboard: (history: ClipboardHistory) => void
}

const prisma = new PrismaClient()


const createClipboard = async (history: ClipboardHistory) => {
	const {
		owner,
		summary,
		contents
	} = history;

	contents.map(content => ({
		...content,
	}))

	const clipboardHistory = await prisma.dBClipboard.create({
		data: {
			summary,
			owner: {
				create: {
					platform: owner.platform,
					path: owner.path,
					name: owner.name,
					bundleId: owner.bundleId,
				}
			},
			contents: {
				create: [
					...contents.map(content => ({
						...content,
						buffers: {
							create: content.buffers
						}
					}))
				]
			}
		}
	})
	return clipboardHistory;
}

const getClipboards = async () => {
	return prisma.dBClipboard.findMany({
		include: {
			owner: true,
			contents: {
				include: {buffers: true}
			}
		}
	});
}

export {
	createClipboard,
	getClipboards
}

export type {
	IClipboardRepository
}