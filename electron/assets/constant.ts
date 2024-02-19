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
  static readonly DIR_STATIC = 'static';
  static readonly DIR_STATIC_C = path.join(Constant.DIR_ROOT, this.DIR_STATIC);
  static readonly BASE64_BLOCK = 'data:image/png;base64,';
  static readonly SAVE_ICON_PATH_BROWSER = '/static/.save_asset_icon';
  static readonly SAVE_ICON_PATH = '.save_asset_icon';
  static readonly SAVE_ICON_PATH_C = path.join(this.DIR_STATIC_C, this.SAVE_ICON_PATH);
  static readonly SAVE_CL_BASE64_PATH = path.join(this.DIR_STATIC, '.save_cl_base64');
  static readonly CLIPBOARD_SUMMARY_BASE64 = '#&BASE64_SUMMARY#&';
  static readonly EXPRESS_PORT = '3001';
  static readonly EXPRESS_HOST= 'localhost:' + this.EXPRESS_PORT;
}

export { Constant };
export type { ClipboardSummary };
