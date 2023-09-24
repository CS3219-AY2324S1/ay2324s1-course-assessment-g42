require("../mongo-db");
const QuestionModel = require('../models/questions.js');

async function getQuestions(req, res) {
  try {
    const result = await QuestionModel.find();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function addQuestion(req, res) {
  try {
    const { id, title, description, categories, complexity } = req.body;
    // Create a new instance of the QuestionModel with the data you want to add
    const newQuestion = new QuestionModel({
      id: id,
      title: title,
      description: description,
      categories: categories,
      complexity: complexity
    });

    // Save the new question document to the database
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion); // Respond with the saved document
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.body;
    const deletedQuestion = await QuestionModel.findOneAndRemove({ id: id });

    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(deletedQuestion); // Respond with the deleted document
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { 
  getQuestions,
  addQuestion,
  deleteQuestion
};
