import path from 'path';

abstract class Constant {
	static readonly DIR_ROOT = process.cwd()
	static readonly DIR_STATIC = path.join(Constant.DIR_ROOT, 'static')
}

export { Constant }