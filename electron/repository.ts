interface IRepository {
	[key: string]: unknown
}

class Repository implements IRepository {
	[key: string]: unknown;
}


export { Repository }

export type {
	IRepository
}