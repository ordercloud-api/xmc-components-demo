/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, SerializedError } from '@reduxjs/toolkit';
import {
  Category,
  Filters,
  ListPageWithFacets,
  Me,
  MetaWithFacets,
  RequiredDeep,
} from 'ordercloud-javascript-sdk';
import { createOcAsyncThunk, OcThrottle } from '../ocReduxHelpers';
import { cacheCategories } from '../ocCategoryCache';

export interface OcCategoryListOptions {
  catalogID?: string;
  productID?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  depth?: string;
  searchOn?: string[];
  sortBy?: string[];
  filters?: Filters;
}

interface OcCategoryListState {
  loading: boolean;
  error?: SerializedError;
  options?: OcCategoryListOptions;
  items?: RequiredDeep<Category>[];
  meta?: MetaWithFacets;
}

const initialState: OcCategoryListState = {
  loading: false,
};

interface SetListOptionsResult {
  response: ListPageWithFacets<Category>;
  options: OcCategoryListOptions;
}

const categoryListThrottle: OcThrottle = {
  location: 'ocCategoryList',
  property: 'loading',
};

export const setListOptions = createOcAsyncThunk<SetListOptionsResult, OcCategoryListOptions>(
  'ocCategoryList/setOptions',
  async (options, ThunkAPI) => {
    const response = await Me.ListCategories();
    ThunkAPI.dispatch(cacheCategories(response.Items));
    return {
      response,
      options,
    };
  },
  categoryListThrottle
);

const ocCategoryListSlice = createSlice({
  name: 'ocCategoryist',
  initialState,
  reducers: {
    clearCategoryList: (state) => {
      state.loading = false;
      state.options = undefined;
      state.error = undefined;
      state.items = undefined;
      state.meta = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setListOptions.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(setListOptions.fulfilled, (state, action) => {
      state.items = action.payload.response.Items as RequiredDeep<Category>[];
      state.meta = action.payload.response.Meta;
      state.options = action.payload.options;
      state.options = action.payload.options;
      state.loading = false;
    });
    builder.addCase(setListOptions.rejected, (state, action) => {
      state.error = action.error;
      state.loading = false;
    });
  },
});

export const { clearCategoryList } = ocCategoryListSlice.actions;

export default ocCategoryListSlice.reducer;
