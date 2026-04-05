import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

export const fetchCourses = createAsyncThunk('courses/fetchAll', async () => {
  const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
})

const coursesSlice = createSlice({
  name: 'courses',
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.list = action.payload })
      .addCase(fetchCourses.rejected, (state) => { state.loading = false })
  },
})

export default coursesSlice.reducer