import { AccessToken, Auth, Tokens } from 'ordercloud-javascript-sdk';
import { clearProductList } from '../ocProductList';
import { createOcAsyncThunk, OcThrottle } from '../ocReduxHelpers';
import { clearUser, getUser } from '../ocUser';
import { cleanProductCache } from '../ocProductCache';

const authAnonymousThrottle: OcThrottle = {
  location: 'ocAuth',
  property: 'loading',
};

const authAnonymous = createOcAsyncThunk<AccessToken | undefined>(
  'ocAuth/authAnonymous',
  async (_, thunkAPI) => {
    const { ocConfig } = thunkAPI.getState();
    if (!ocConfig.value) {
      throw new Error('OrderCloud Provider was not properly configured');
    }

    thunkAPI.dispatch(clearUser());
    thunkAPI.dispatch(clearProductList());
    thunkAPI.dispatch(cleanProductCache());

    const response = await Auth.Anonymous(ocConfig.value.clientId, ocConfig.value.scope);

    Tokens.SetAccessToken(response.access_token);

    thunkAPI.dispatch(getUser());
    return response;
  },
  authAnonymousThrottle
);

export default authAnonymous;
