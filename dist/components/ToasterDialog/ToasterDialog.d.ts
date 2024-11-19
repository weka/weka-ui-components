import { DIALOG_STATUSES } from '../../consts.ts';
export type DialogStatus = (typeof DIALOG_STATUSES)[keyof typeof DIALOG_STATUSES];
declare function ToasterDialog(): null;
export default ToasterDialog;
