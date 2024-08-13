/* eslint-disable @typescript-eslint/no-explicit-any */
import { OcCurrentOrderState } from '../redux/ocCurrentOrder';
import { useOcSelector } from '../redux/ocStore';

const useOcCurrentOrder = (): OcCurrentOrderState => useOcSelector((s: any) => s.ocCurrentOrder);

export default useOcCurrentOrder;
