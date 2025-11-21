import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../redux/authSlice'
import classes from './login.module.css'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async(e) => {
    e.preventDefault()

    try {
        // USE THE ENVIRONMENT VARIABLE HERE
        const res = await fetch(`http://localhost:5003/auth/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({email, password})
        })

        // BETTER ERROR HANDLING
        if(!res.ok){
            const msg = await res.json()
            throw new Error(msg?.msg || "Login failed")
        }

        const data = await res.json()
        dispatch(login(data))
        navigate('/')
    } catch (error) {
        console.error(error)
        setError(true)
        setTimeout(() => {
            setError(false)
        }, 2500)
    }
  }

  return (
    <div className={classes.container}>
        <div className={classes.wrapper}>
            <h2 className={classes.title}>Login</h2>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">
                    <input onChange={(e) => setEmail(e.target.value)} type="email" id='email' placeholder='Enter email'/>
                </label>
                <label htmlFor="password">
                    <input onChange={(e) => setPassword(e.target.value)} type="password" id='password' placeholder='Enter password'/>
                </label>
                <button className={classes.submitBtn}>Login</button>
                <Link to="/register">Don't have an account? <p className={classes.register}>Register now</p></Link>
            </form>
            {error && 
           <div className={classes.errorMessage}>
                Wrong credentials! Try different ones.
            </div>
            }
        </div>
    </div>
  )
}

export default Login