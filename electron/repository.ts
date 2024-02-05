import { PrismaClient } from '@prisma/client';
import { ClipboardHistory } from './clipboard';
import { saveAppIcon } from './assets/icon';

interface ClipboardsQuery {
  ownerId?: number;
  summary?: string;
  type?: 'text' | 'buffers' | 'base64',
}
const prisma = new PrismaClient();

const createClipboard = async (history: ClipboardHistory) => {
  const { owner, summary, contents } = history;

  const ownerRecord = await prisma.dBClipboardOwner.findUnique({
    where: { path: owner.path },
  });
  // 如果owner不存在，则创建一个本地图标
  if (!ownerRecord) void saveAppIcon(owner.path);
  const ownerCreate = ownerRecord ? { ownerId: ownerRecord.id } : { owner: { create: owner } };

  const contentsCreate = {
    contents: {
      create: contents.map(content => ({
        ...content,
        buffers: { create: content.buffers },
      })),
    },
  };

  return prisma.dBClipboard.create({
    data: {
      summary,
      ...ownerCreate,
      ...contentsCreate,
    },
  });
};

const getClipboards: (query?: ClipboardsQuery) => Promise<ClipboardHistory[]> = async (query) => {
  const records = await prisma.dBClipboard.findMany({
    where: {
      ownerId: query?.ownerId
    },
    include: {
      owner: true,
      contents: {
        include: { buffers: true },
      },
      type: true
    },
  });

  return records.map(record => ({
    ...record,
    type: record.type.map(type => type.name)
  }));
};

export { createClipboard, getClipboards };
