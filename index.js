const express = require('express')
const app = express()
app.use(express.json())
var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));
const cors = require('cors')
app.use(cors())
app.use(express.static('dist'))

let persons = [
  
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]
  
    app.get('/', (request, response) => {
      response.send('<h1>Hello World!</h1>')
    })

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)
  response.json(person)
})

const generateId = () => {
  const ID= Math.floor(Math.random()* 10000)
  return ID
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})