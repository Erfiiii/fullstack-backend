const {
  makeExecutableSchema
} = require('graphql-tools')
const Task = require('../models/task')
const AuthService = require('../services/auth')

const typeDefs = `
  type User{
  id:ID
  email:String!
  tasks:[Task]
}

type Task{
  id:ID
  content:String
  priority:String
  date:String
}

type Query {
  currentUser:User
}

type Mutation {
  signup(email:String!,password:String!):User
  login(email:String!,password:String!):User
  addTask(content:String!,priority:String,date:String):Task
  editTask(id:ID!,priority:String!):Task
  deleteTask(id:ID):Task
}
`;

const resolvers = {
  Query: {
    currentUser(root, args, {
      req
    }) {
      return req.user
    }
  },
  Mutation: {
    signup(root, {
      email,
      password
    }, {
      req
    }) {
      return AuthService.signup({
        email,
        password,
        req
      })
    },
    login(root, {
      email,
      password
    }, {
      req
    }) {
      return AuthService.login({
        email,
        password,
        req
      })
    },
    addTask(root, {
      content,
      priority,
      date
    }, {
      req
    }) {
      const task = new Task({content,priority,date})
      return User.findById(req.user.id).then((user)=>{
         user.tasks.push(task)
         return task
      })
    },
    editTask(root, {
      priority,
      date,
      id
    }, {
      req
    }) {
      const task = Task.findById(id).then(task => {
        task.priority = priority;
        task.date = date
      })

      return task.save().then(task => {
        return task
      })
    },
    deleteTask(root, {
      id
    }, {
      req
    }) {
      const task = Task.findById(id)
      Task.deleteOne({
        id
      })
      return task
    }
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})