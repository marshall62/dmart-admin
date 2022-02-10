import {atom} from 'recoil';
import { IArtwork } from 'models/artwork';
 
export const artworksState = atom<IArtwork[]>({
   key: 'artworksState',
   default: [],
 }
);
