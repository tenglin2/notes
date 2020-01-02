const express = require('express');
// Body parser required for post requests.
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// Forgot to add this.
// This is confusing. JSON, json() and .json(). Very confusing.
app.use(bodyParser.json());
app.use(cors);

let notes = [
	{
		id: 1,
		content: 'HTML is easy',
		date: '2019-05-30T17:30:31.098Z',
		important: true
	},
	{
		id: 2,
		content: 'Browser can execute only Javascript',
		date: '2019-05-30T18:39:34.091Z',
		important: false
	},
	{
		id: 3,
		content: 'GET and POST are the most important methods of HTTP protocol',
		date: '2019-05-30T19:20:14.298Z',
		important: true
	}
];

app.get('/', (request, response) => {
	// Sending the response as a string automatically sets the content type to text/html. I'm pretty sure arrays and objects are interpreted as application/json automatically. How do I force it?
	response.send('<h1>Hello BRO DOPE ADDITION</h1>');
});

app.get('/notes', (request, response) => {
	response.json(notes);
});

app.get('/notes/:id', (request, response) => {
	// Request params interpreted as a string initially.
	let id = Number(request.params.id);
	let note = notes.filter((note) => note.id === id);

	if (note) {
		response.json(note);
	} else response.status(404).end();
});

app.delete('/notes/:id', (request, response) => {
	let id = Number(request.params.id);
	notes = notes.filter((note) => note.id !== id);

	response.status(204).end();
});

const generateId = () => {
	const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
	return maxId + 1;
};

app.post('/notes', (request, response) => {
	const body = request.body;
	console.log(body);

	if (!body.content) {
		return response.status(400).json({
			error: 'content missing'
		});
	}

	const note = {
		content: body.content,
		important: body.important || false,
		date: new Date(),
		id: generateId()
	};

	notes = notes.concat(note);

	response.json(note);
});

const PORT = process.env.PORT || 3001;
// Listen function has optional callback on listen which you use to do a console.
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});

// In the previous example we used JSON.stringify on the notes but this time you don't need to because express handles it.
// There's a difference. The whole point of transferring data between networks it to first convert it to a string which has less bytes than a whole object. That's why you stringify before sending off. So basically JSON.stringify(someObject) makes it an appropriate type to send over a connection.

// NODEMON does not refresh the browser but it does refresh the server on application change. Hot reloading makes the browser refresh on server changes.
