/* eslint-disable @typescript-eslint/no-unused-vars */
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Me, RequiredDeep } from 'ordercloud-javascript-sdk';
import { createOcAsyncThunk } from '../ocReduxHelpers';
import { OcCategoryListOptions } from '../ocCategoryList';
import { OcRootState } from '../ocStore';

export const ocCategoriesAdapter = createEntityAdapter<RequiredDeep<Category>>({
  selectId: (p) => p.ID,
});

export const ocCategoryCacheSelectors = ocCategoriesAdapter.getSelectors<OcRootState>(
  (s) => s.ocCategoryCache
);

export const listCategories = createOcAsyncThunk<RequiredDeep<Category>[], OcCategoryListOptions>(
  'ocCategories/list',
  async () => {
    const response = await Me.ListCategories();
    return response.Items;
  }
);

export const getCategory = createOcAsyncThunk<RequiredDeep<Category>, string>(
  'ocCategories/get',
  async (categoryID) => {
    const response = await Me.GetCategory(categoryID);
    return response;
  }
);

const ocCategoryCacheSlice = createSlice({
  name: 'ocCategories',
  initialState: ocCategoriesAdapter.getInitialState(),
  reducers: {
    cleanCategoryCache: (state) => {
      ocCategoriesAdapter.removeAll(state);
    },
    cacheCategories: (state, action: PayloadAction<RequiredDeep<Category>[]>) => {
      ocCategoriesAdapter.upsertMany(state, action);
    },
    cacheCategory: (state, action: PayloadAction<RequiredDeep<Category>>) => {
      ocCategoriesAdapter.upsertOne(state, action);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(listCategories.fulfilled, ocCategoriesAdapter.upsertMany);
    builder.addCase(getCategory.fulfilled, ocCategoriesAdapter.upsertOne);
  },
});

export const { cacheCategories, cacheCategory, cleanCategoryCache } = ocCategoryCacheSlice.actions;

export default ocCategoryCacheSlice.reducer;
