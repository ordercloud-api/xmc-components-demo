import { AnyAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import ocConfig from './ocConfig';
import ocErrors from './ocErrors';
import ocAuth from './ocAuth';
import ocUser from './ocUser';
import ocCategoryCache from './ocCategoryCache';
import ocCategoryList from './ocCategoryList';
import ocProductCache from './ocProductCache';
import ocProductList from './ocProductList';
import ocProductDetail from './ocProductDetail';
import ocCurrentOrder from './ocCurrentOrder';
import ocAddressBook from './ocAddressBook';
import ocProductSpecsCache from './ocProductSpecsCache';
//import ocOrderCache from "./ocOrderCache"
//import ocOrderList from "./ocOrderList"

const store = configureStore({
  reducer: {
    ocConfig,
    ocErrors,
    ocAuth,
    ocUser,
    ocAddressBook,
    ocCategoryCache,
    ocCategoryList,
    ocProductCache,
    ocProductList,
    ocProductDetail,
    //ocOrderCache,
    //ocOrderList,
    ocCurrentOrder,
    ocProductSpecsCache,
  },
});

export type OcRootState = ReturnType<typeof store.getState>;
export type OcDispatch = typeof store.dispatch;
export type OcThunkApi = {
  dispatch: OcDispatch;
  state: OcRootState;
};

export const useOcDispatch = (): ThunkDispatch<OcRootState, null, AnyAction> =>
  useDispatch<OcDispatch>();
export const useOcSelector: TypedUseSelectorHook<OcRootState> = useSelector;

export default store;
