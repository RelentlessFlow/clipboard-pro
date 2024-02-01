import { PrismaClient } from "@prisma/client";
import { ClipboardHistory } from "./clipboard";
import { saveAppIcon } from "./assets/icon";

const prisma = new PrismaClient()

const createClipboard = async (history: ClipboardHistory) => {
	const { owner,  summary,  contents } = history;
	const ownerRecord = await prisma.dBClipboardOwner.findUnique({
		where: { path: owner.path }
	});
	// 如果owner不存在，则创建一个本地图标
	if(!ownerRecord) saveAppIcon(owner.path)
	const ownerCreate = ownerRecord ? { ownerId: ownerRecord.id } : { owner: { create: owner } };
	const contentsCreate = {
		contents: {
			create: contents.map(content => ({
					...content, buffers: { create: content.buffers }
			}))
		}
	}
	return prisma.dBClipboard.create({
		data: {
			summary,
			...ownerCreate,
			...contentsCreate,
		},
	});
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