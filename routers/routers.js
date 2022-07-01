const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

const db = require("../data/database");

const ObjectId = mongodb.ObjectId;

router.get("/", (req, res) => {
	res.redirect("/todos");
});

router.get("/todos", async (req, res) => {
	const todoItems = await db.getDb().collection("todos").find().toArray();
	console.log(todoItems);
	res.render("todo-lists", { todoItems: todoItems });
});

router.post("/todos", async (req, res) => {
	const levelId = new ObjectId(req.body.level);
	const levelData = await db
		.getDb()
		.collection("levels")
		.findOne({ _id: levelId });
	const newTodo = {
		todo: req.body.todo,
		details: req.body.details,
		level: {
			id: levelId,
			level: levelData.level,
		},
	};
	await db.getDb().collection("todos").insertOne(newTodo);
	res.redirect("/");
});

router.get("/todos/:todoId/edit", async (req, res) => {
	const todoId = new ObjectId(req.params.todoId);
	console.log("ASDFASDF  =>" + req.params.todoId);
	console.log("asdfasdf  =>" + todoId);
	const levels = await db.getDb().collection("levels").find({}).toArray();

	const todoItem = await db
		.getDb()
		.collection("todos")
		.findOne({ _id: todoId });

	res.render("edit-todo", { todo: todoItem, levels: levels });
});

router.post("/todos/:todoId/edit", async (req, res) => {
	const todoId = new ObjectId(req.params.todoId);
	const levelId = new ObjectId(req.body.level);
	const levels = await db
		.getDb()
		.collection("levels")
		.findOne({ _id: levelId });
	const formData = {
		todo: req.body.todo,
		details: req.body.details,
		levelId: req.body.level,
		level: levels.level,
	};

	await db
		.getDb()
		.collection("todos")
		.updateOne(
			{ _id: todoId },
			{
				$set: {
					todo: formData.todo,
					details: formData.details,
					level: {
						id: todoId,
						level: formData.level,
					},
				},
			}
		);
	res.redirect("/");
});

router.post("/todos/:todoId/delete", async (req, res) => {
	const todoId = new ObjectId(req.params.todoId);
	await db.getDb().collection("todos").deleteOne({ _id: todoId });
	res.redirect("/");
});

router.get("/create-todo", async (req, res) => {
	const levels = await db.getDb().collection("levels").find({}).toArray();
	res.render("create-todo", { levels: levels });
});

module.exports = router;
