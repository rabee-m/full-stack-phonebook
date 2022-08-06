const mongoose = require('mongoose')

let phonebookDisplay = false

if (process.argv.length == 3) {
    phonebookDisplay = true
} else if (process.argv.length <= 4) {
    console.log('Usage: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
let personName = null
let personNumber = null


if (!phonebookDisplay) {
    personName = process.argv[3]
    personNumber = process.argv[4]
}


const url = `mongodb+srv://rabee123:${password}@cluster0.6fhxpao.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (phonebookDisplay) {
    console.log('Phonebook:')
    mongoose
        .connect(url)
        Person
        .find({})
        .then(persons => {
        persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    mongoose
        .connect(url)
        .then((result => {
            const person = new Person ({
                name: personName,
                number: personNumber
            })
            return person.save()
        }))
        .then(() => {
            console.log(`added ${personName} number ${personNumber}`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}