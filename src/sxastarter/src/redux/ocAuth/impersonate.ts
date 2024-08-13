import { DecodedToken, Tokens } from 'ordercloud-javascript-sdk'
import parseJwt from 'src/utils/parseJwt'
import { clearCurrentOrder, retrieveOrder } from '../ocCurrentOrder'
import { cleanProductCache } from '../ocProductCache'
import { clearProductList } from '../ocProductList'
import { createOcAsyncThunk } from '../ocReduxHelpers'
import { clearUser, getUser } from '../ocUser'

const impersonate = createOcAsyncThunk<DecodedToken, string>(
  'ocAuth/impersonate',
  async (token, thunkAPI) => {
    const { ocConfig } = thunkAPI.getState()
    if (!ocConfig.value) {
      throw new Error('OrderCloud Provider was not properly configured')
    }

    let decodedToken

    // TODO: could take this further and check if the token is still active
    // and for the currently configured client ID.
    try {
      decodedToken = parseJwt(token)
    } catch (ex) {
      return Promise.reject(ex)
    }

    // We have to clear these items as the authenticated user is changing. Similar
    // to logout() but instead of falling back to authAnonymous we want it to just
    // set the token and retrieve the user & current order right away, so I followed
    // the pattern of login() after clearing redux states.
    thunkAPI.dispatch(clearUser())
    thunkAPI.dispatch(clearCurrentOrder())
    thunkAPI.dispatch(clearProductList())
    thunkAPI.dispatch(cleanProductCache())

    Tokens.SetAccessToken(token)

    await thunkAPI.dispatch(getUser())
    await thunkAPI.dispatch(retrieveOrder())

    return Promise.resolve(decodedToken)
  }
)

export default impersonate
