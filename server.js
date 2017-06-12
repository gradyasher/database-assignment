const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {Blog, Grady} = require('./models');
console.log(Grady)

const app = express();
app.use(bodyParser.json());

app.get('/blogs', (req,res) => {
	const filters = {}
	const queryableFields =['title', 'author']
	queryableFields.forEach(field => {
		if(req.query[field]) {
			filters[field] = req.query[field]
		}
	})

	Blog
	.find()
	.limit(10)
	.exec()
	.then(blogs => {
		res.json({
			blogs: blogs.map(blog => blog.apiRepr())
		})
	})
	.catch(
		err=> {
			console.error(err)
			res.status(500).json({message: "Internal Server Error"})
		})
})

app.get('/blogs/:id', (req,res) => {
	Blog
		.findById(req.params.id)
		.exec()
		.then(blog => res.json(blog.apiRepr()))
		.catch(err=> {
			console.error(err)
			res.status(500).json("Internal Server Error")
		})
})

app.post('/blogs', (req, res) => {
	const requiredFields = ["title", "content", "author"]
	for(let i =0; i <requiredFields.length; i++) {
		const field = requiredFields[i]
		if(!(field in req.body))	{
			const message = `Missing \`${field}\` in request body`
			console.error(message)
			return status(400).send(message)
		}
	}

	Blog
	.create({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author })
	.then(
		blog => res.status(201).json(blog.apiRepr()))
	.catch(err => {
		console.error(err)
		res.status(500).json({message: "Internal Server Error"})
	})
})

app.put('/blogs/:id', (req, res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (`Request path id ${req.params.id} and request body id ${req.body.id} must match`)
		console.error(message)
		res.status(400).json({message: message})
	}

	const toUpdate = {}
	const updateableFields = ["title", "author", "content"]

	updateableFields.forEach(field => {
		if(field in req.body) {
			toUpdate[field] = req.body[field]
		}
	})
	console.log(toUpdate)

	Blog
	.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.exec()
	.then(blog => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal Server Error'}))
})

app.delete("/blogs/:id", (req, res) =>{
	Blog
		.findByIdAndRemove(req.params.id)
		.exec()
		.then(blog => res.status(204).end())
		.catch(err => res.status(500).json({message: "Internal Server Error"}))
})

app.use("*", function(req, res) {
	res.status(500).json({message: "Not Found"})
})

const startServer = (err) => { 
	if(err){
		return console.error(err)
	}
	app.listen(process.env.PORT || 8080, () => {
  	console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
	});
};

mongoose.connect('mongodb://user1:user1@ds161021.mlab.com:61021/database-assignment', startServer);


