import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signinStart, signinFailure, signinSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const {error, loading} = useSelector((state) =>  state.user)

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      dispatch(signinStart())
      const res = await fetch('/api/auth/signin', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(signinFailure(data.message))
        return;
      }
      dispatch(signinSuccess(data))
      navigate('/')
      console.log(data);
    } catch (err) {
      dispatch(signinFailure(data.message))
    }
    
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
        <input 
        type="email" 
        id='email'
        placeholder='email' 
        className='border p-3 rounded-lg' 
        required
        autoComplete='off'
        onChange={handleChange}
        />
        <input 
        type="password" 
        id='password'
        placeholder='password' 
        className='border p-3 rounded-lg' 
        required
        autoComplete='off'
        onChange={handleChange}
        />
        <button 
        className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80 disabled:cursor-not-allowed'
        disabled={loading}
        >{loading ? "Loading..." : "Sign In"}</button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account ? </p>
        <Link to="/sign-up">
          <span className='text-blue-700 hover:underline'>Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p> }
    </div>
  )
}

export default SignIn