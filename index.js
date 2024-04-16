require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

const Person = require('./models/person')


let persons = [

    ]
  


    app.get('/info', (request, response) => {
      let n = persons.length
      const res =`
        <p>Phonebook has info for ${n} people</p>
        <p> ${new Date()}</p>
        </body>
      `
      response.send(res)
    })

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
  })


app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  
  const body = request.body
  const duplicate = persons.filter(person => person.name === body.name).length
  console.log(body)
  console.log(duplicate)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error : 'name or number missing'
    })
  }

  if (duplicate != 0) {
    return response.status(400).json({
      error : 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const generateId = () => {
  const ID= Math.floor(Math.random()* 10000)
  return ID
}


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})