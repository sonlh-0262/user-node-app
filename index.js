import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))

app.get('/hello', (req, res) => {
  return res.status(200).send('Hello world 111')
})

let database = {
  users: [
    { id: 1, name: 'User 1', email: 'Email 1', timeStamp: '2021-06-06T05:43:48.759Z' }
  ]
}

const findUser = (users, userId) => {
  return users.find(u => u.id === parseInt(userId))
}

app.get('/users', (req, res) => {
  return res.status(200).json(database.users)
})

app.post('/users', (req, res) => {
  let newUser = req.body

  if (!newUser || !newUser.name || !newUser.email) {
    return res.status(400).send('Make valid user with name and email')
  }

  newUser.timeStamp = new Date().toISOString()
  newUser.id = database.users.length + 1
  database.users.push(newUser)

  return res.status(200).json(newUser)
})

app.get('/users/:id', (req, res) => {
  const user = findUser(database.users, req.params.id)

  if (!user) {
    return res.status(404).send('User is not found')
  }

  return res.status(200).json(user)
})

app.put('/users/:id', (req, res) => {
  let user = findUser(database.users, req.params.id)

  if (!user) {
    return res.status(404).send('User is not found')
  }

  const { email, name } = req.body
  user.email = email || user.email
  user.name = name || user.name
  database.users = database.users.map(u => {
    if (u.id === user.id)
      return user
    else
      return u
  })

  return res.status(200).json(user)
})

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id
  const user = findUser(database.users, userId)

  if (!user) {
    return res.status(404).send('User is not found')
  }

  database.users = database.users.filter(u => u.id !== parseInt(userId))
  return res.status(200).send('User is deleted successfully')
})

const port = process.env.PORT || '3000'
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
