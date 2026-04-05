import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  student: JSON.parse(localStorage.getItem('smit_student')) || null,
  admin: JSON.parse(localStorage.getItem('smit_admin')) || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStudent: (state, action) => {
      state.student = action.payload
      localStorage.setItem('smit_student', JSON.stringify(action.payload))
    },
    logoutStudent: (state) => {
      state.student = null
      localStorage.removeItem('smit_student')
    },
    loginAdmin: (state, action) => {
      state.admin = action.payload
      localStorage.setItem('smit_admin', JSON.stringify(action.payload))
    },
    logoutAdmin: (state) => {
      state.admin = null
      localStorage.removeItem('smit_admin')
    },
  },
})

export const { loginStudent, logoutStudent, loginAdmin, logoutAdmin } = authSlice.actions
export default authSlice.reducer