import path from 'path';

type ConstantType = typeof Constant;
type ConstantKeys = keyof ConstantType;
type ClipboardSummaryPrefix = 'CLIPBOARD_SUMMARY';
type ClipboardSummary =
	| ConstantType[ConstantKeys &
			keyof {
			  [K in ConstantKeys as K extends `${ClipboardSummaryPrefix}${string}` ? K : never]: never;
			}]
	| string;
abstract class Constant {
  static readonly DIR_ROOT = process.cwd();
  static readonly DIR_STATIC = path.join(Constant.DIR_ROOT, 'static');
  static readonly BASE64_BLOCK = 'data:image/png;base64,';
  static readonly SAVE_ICON_PATH = path.join(this.DIR_STATIC, '.save_asset_icon');
  static readonly SAVE_CL_BASE64_PATH = path.join(this.DIR_STATIC, '.save_cl_base64');
  static readonly CLIPBOARD_SUMMARY_BASE64 = '#&BASE64_SUMMARY#&';
}

export { Constant };
export type { ClipboardSummary };
