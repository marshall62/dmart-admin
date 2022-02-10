import {atom} from 'recoil';
 
export const tagsState = atom<Set<string>>({
   key: 'tagsState',
   default: new Set([]),
 }
);
