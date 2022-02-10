import {atom} from 'recoil';
import {IConfig} from 'models/config'
 
export const configState = atom<IConfig>({
   key: 'configState',
   default: {} as IConfig,
 }
);
