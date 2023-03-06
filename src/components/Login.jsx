import { LockOutlined } from "@mui/icons-material"
import { Avatar, Button, Paper, TextField } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import { BaseUrl } from "../environment"



const Login = () => {

  const paperStyle = { width: 300, height: '70vh', margin: '4rem auto', padding: '2rem' }
  const avatarStyle = { backgroundColor: '#33cba5' }
  const btnstyle = { margin: '1rem 0' }

  const [inputs, setInputs] = useState({})


  /* 存储输入的inputs数据 */
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    axios.post(`${BaseUrl}login`, inputs)
      .then(res => {
        localStorage.setItem("react-demo-token", res.data.token.token)
        localStorage.setItem('react-demo-user', JSON.stringify(res.data.user))

        setTimeout(window.location.reload(), 2000)
      })
      .catch(err => console.log(err))
  }



  return (
    <>
      <Paper align="center" elevation={10} sx={paperStyle}>
        <Avatar sx={avatarStyle}>
          <LockOutlined />
        </Avatar>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <TextField onChange={handleChange} name="email" label="Email" placeholder="Enter your email" variant="standard" fullWidth />
          <TextField onChange={handleChange} type="password" name="password" label="Password" placeholder="Enter your password" variant="standard" fullWidth />
          <Button type="submit" variant="contained" fullWidth sx={btnstyle}>
            SIGN IN
          </Button>
        </form>
      </Paper>
    </>
  )
}

export default Login