import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { Me, MeUser, RequiredDeep } from 'ordercloud-javascript-sdk';
import { createOcAsyncThunk, OcThrottle } from '../ocReduxHelpers';

interface ocUserState {
  user?: MeUser;
  loading: boolean;
  error?: SerializedError;
  travelStartDate?: string;
  travelEndDate?: string;
  isApprovalAdmin?: boolean;
}

const initialState: ocUserState = {
  loading: false,
};

const userThrottle: OcThrottle = {
  location: 'ocUser',
  property: 'loading',
};

interface UserWithAdmin extends RequiredDeep<MeUser> {
  isApprovalAdmin?: boolean
  }

export const getUser = createOcAsyncThunk<UserWithAdmin, undefined>(
  'ocUser/get',
  async () => {
    const ugList = await Me.ListUserGroups();
    const isAdmin = !!ugList.Items?.filter(ug => ug.ID === "administrators").length
    const me = await Me.Get() as UserWithAdmin
    me.isApprovalAdmin = isAdmin;
    return me;
  },
  userThrottle
);

export const updateUser = createOcAsyncThunk<Partial<MeUser>, RequiredDeep<MeUser>>(
  'ocUser/update',
  async (data) => {
    return Me.Patch(data);
  }
);

const ocUserSlice = createSlice({
  name: 'ocUser',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = undefined;
    },
    updateTravelStartDate: (state, action: PayloadAction<string>) => {
      state.travelStartDate = action.payload;
    },
    updateTravelEndDate: (state, action) => {
      state.travelEndDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.user = undefined;
      state.error = action.error;
      state.loading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export const { clearUser, updateTravelEndDate, updateTravelStartDate } = ocUserSlice.actions;

export default ocUserSlice.reducer;
