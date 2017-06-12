const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
	'title': {type: String, required: true},
	'content': {type: String, required: true},
	'author': {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	'created': {type: String, required: false}
})

blogSchema.virtual('authorString').get(function() {
	return `${this.author.firstName} ${this.author.lastName}`.trim()
})

blogSchema.methods.apiRepr = function() {

	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.authorString,
		created: this.created
	}
}

const Blog = mongoose.model(`Blog`, blogSchema)

const Grady = "grady"

module.exports = {Blog, Grady}