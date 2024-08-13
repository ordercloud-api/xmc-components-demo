/* eslint-disable @typescript-eslint/no-explicit-any */
import { BuyerProduct, RequiredDeep, Spec, Variant } from 'ordercloud-javascript-sdk';
import { useEffect, useMemo } from 'react';
import { setProductId } from '../redux/ocProductDetail';
import { useOcDispatch, useOcSelector } from '../redux/ocStore';

const useOcProductDetail = (
  productId: string
): {
  product?: RequiredDeep<BuyerProduct>;
  specs?: RequiredDeep<Spec>[];
  variants?: RequiredDeep<Variant>[];
} => {
  const dispatch = useOcDispatch();

  const { product, specs, variants, isAuthenticated } = useOcSelector((s: any) => ({
    product: s.ocProductDetail.product,
    specs: s.ocProductDetail.specs,
    variants: s.ocProductDetail.variants,
    isAuthenticated: s.ocAuth.isAuthenticated,
  }));

  useEffect(() => {
    const dispatchSetProductId = (productId: string) => dispatch(setProductId(productId));
    let promise: ReturnType<typeof dispatchSetProductId>;
    if (productId && isAuthenticated) {
      promise = dispatchSetProductId(productId);
    }
    return () => promise && promise.abort();
  }, [dispatch, productId, isAuthenticated]);

  const result = useMemo(
    () => ({
      product,
      specs,
      variants,
    }),
    [product, specs, variants]
  );

  return result;
};

export default useOcProductDetail;
