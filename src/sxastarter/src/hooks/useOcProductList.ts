/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from 'ordercloud-javascript-sdk';
import { useEffect } from 'react';
import { isEqual } from 'lodash';
import { OcProductListOptions, setListOptions } from '../redux/ocProductList';
import { useOcDispatch, useOcSelector } from '../redux/ocStore';

const useOcProductList = (listOptions: OcProductListOptions): Product[] => {
  const dispatch = useOcDispatch();

  const { products, options, isAuthenticated } = useOcSelector((s: any) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    products: s.ocProductList.items,
    options: s.ocProductList.options,
  }));

  useEffect(() => {
    const dispatchSetListOptions = (listOptions: OcProductListOptions) =>
      dispatch(setListOptions(listOptions));
    let promise: ReturnType<typeof dispatchSetListOptions>;
    if (isAuthenticated && (!options || (options && !isEqual(listOptions, options)))) {
      promise = dispatchSetListOptions(listOptions);
    }
    return () => promise && promise.abort();
  }, [dispatch, options, listOptions, isAuthenticated]);

  return products;
};

export default useOcProductList;
