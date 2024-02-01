import path from 'path';

type ConstantType = typeof Constant
type ConstantKeys = keyof ConstantType;
type ClipboardSummaryPrefix = 'CLIPBOARD_SUMMARY'
type ClipboardSummary = ConstantType[
	ConstantKeys & keyof {
	[K in ConstantKeys as K extends `${ClipboardSummaryPrefix}${string}` ? K : never]: never
}
	] | string

abstract class Constant {
	static readonly DIR_ROOT = process.cwd()
	static readonly DIR_STATIC = path.join(Constant.DIR_ROOT, 'static')
	static readonly CLIPBOARD_SUMMARY_BASE64 = '#&BASE64_SUMMARY#&'
}

export {
	Constant
}

export type {
	ClipboardSummary
}