import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { supabase } from '../../lib/supabaseClient'

export const fetchStudentLeaves = createAsyncThunk('leaves/fetchStudent', async (studentId) => {
  const { data, error } = await supabase.from('leaves').select('*').eq('student_id', studentId).order('created_at', { ascending: false })
  if (error) throw error
  return data
})

export const fetchAllLeaves = createAsyncThunk('leaves/fetchAll', async () => {
  const { data, error } = await supabase.from('leaves').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
})

const leavesSlice = createSlice({
  name: 'leaves',
  initialState: { list: [], allLeaves: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentLeaves.fulfilled, (state, action) => { state.list = action.payload })
      .addCase(fetchAllLeaves.fulfilled, (state, action) => { state.allLeaves = action.payload })
  },
})

export default leavesSlice.reducer