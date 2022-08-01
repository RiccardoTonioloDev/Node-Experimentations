exports.getPosts = (req, res, next) => {
	//È importante esplicitare sempre il codice di stato
	res.status(200).json({
		posts: [{ title: 'Primo post', content: 'Questo è il primo post!' }],
	});
};

exports.createPost = (req, res, next) => {
	const title = req.body.title;
	const content = req.body.content;

	//201 come status code è specifico nel dire che una risorsa è stata creata con successo.
	res.status(201).json({
		message: 'Post created succesfully!',
		post: {
			id: new Date().toISOString(),
			title: title,
			content: content,
		},
	});
};
