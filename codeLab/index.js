const express = require('express')
const fs = require('fs')
app = express()
app.use(express.static('./static'))
app.use(express.json())

app.get('/todo',(req,res,next)=>{
    const data = JSON.parse(fs.readFileSync('./data.json',{encoding:'utf-8'}))
    if(!data.length){
        res.status(404).json('No data found')
        debugger
    }else{
        res.json(data)
    }
})

app.get('/todo/:id',(req,res,next)=>{
    const {id} = req.params
    const data = JSON.parse(fs.readFileSync('./data.json',{encoding:'utf-8'}))
    const todoList = data.find(todo=>+todo.ID === +id) 
    console.log(todoList)
    if(!data.length){
        res.status(404).json('No data found')
    }else{
        if(!todoList){
            res.status(400).json('Enter valid ID')
        }else{
            res.json(todoList)
        } 
    }
})

app.post('/todo',(req,res,next)=>{
    const {ID,note} = req.body
    const data = JSON.parse(fs.readFileSync('./data.json',{encoding:'utf-8'}))
    if(!note){
        res.status(400).json('Note not found')
    }else{
        if(!data.length){
            let id2 = 1
            const todo = {ID:id2,note}
            console.log(data)
            data.push(todo)
            fs.writeFileSync('./data.json',JSON.stringify(data))
            res.status(200).json('Done')
        }else{
            let incr = data[data.length-1].ID+1
            const todo = {ID:incr,note}
            data.push(todo)
            fs.writeFileSync('./data.json',JSON.stringify(data))
            res.status(200).json(todo)
        }
    }
})

app.delete('/todo/:id',(req,res,next)=>{
    const {id} = req.params
    const data = JSON.parse(fs.readFileSync('./data.json',{encoding:'utf-8'}))
    try{
        if(!data){
            res.status(400).json('No data found')
        }else{
            const newData = data.filter((ele)=>{
                return +ele.ID !== +id
            })
            fs.writeFileSync('./data.json',JSON.stringify(newData))
            res.status(200).json('Deleted!')
        }
    }catch(e){
        res.status(404).json(e)
    }
})

app.patch('/todo/:id',(req,res,next)=>{
    const {id} = req.params
    const {note} = req.body
    const data = JSON.parse(fs.readFileSync('./data.json',{encoding:'utf-8'}))
    if(!note || !id || id ==''){
        res.status(400).json('u must write a note and valid id')
    }else{
        let neededEl = data.find((el)=>{
            return el.ID == id
        })
        neededEl.note = note
        fs.writeFileSync('./data.json',JSON.stringify(data))
        res.status(200).json('Updated Successfully!')
    }
})

app.listen(3000,()=>{console.log('running on port:3000')})
