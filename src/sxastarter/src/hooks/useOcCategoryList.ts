/* eslint-disable @typescript-eslint/no-explicit-any */
import { OcCategoryListOptions, setListOptions } from '../redux/ocCategoryList';
import { useOcDispatch, useOcSelector } from '../redux/ocStore';

import { Category } from 'ordercloud-javascript-sdk';
import { isEqual } from 'lodash';
import { useEffect } from 'react';

const useOcCategoryList = (listOptions: OcCategoryListOptions): Category[] => {
  const dispatch = useOcDispatch();

  const { categories, options, isAuthenticated } = useOcSelector((s: any) => ({
    isAuthenticated: s.ocAuth.isAuthenticated,
    categories: s.ocCategoryList.items,
    options: s.ocCategoryList.options,
  }));

  useEffect(() => {
    const dispatchSetListOptions = (listOptions: OcCategoryListOptions) =>
      dispatch(setListOptions(listOptions));
    let promise: ReturnType<typeof dispatchSetListOptions>;
    if (isAuthenticated && (!options || (options && !isEqual(listOptions, options)))) {
      promise = dispatchSetListOptions(listOptions);
    }
    return () => promise && promise.abort();
  }, [dispatch, options, listOptions, isAuthenticated]);

  return categories;
};

export default useOcCategoryList;
