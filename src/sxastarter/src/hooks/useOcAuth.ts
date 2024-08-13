/* eslint-disable @typescript-eslint/no-explicit-any */
import { OcAuthState } from '../redux/ocAuth';
import { useOcSelector } from '../redux/ocStore';

const useOcAuth = (): OcAuthState => useOcSelector((s: any) => s.ocAuth);

export default useOcAuth;
