require("../mongo-db");
const QuestionModel = require('../models/questions.js');

async function getQuestions(req, res) {
  try {
    const { page, pageSize } = req.body || { page: 1, pageSize: 10 };

    // Ensure the values are integers and handle any validation as needed
    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);
    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return res.status(400).json({ error: 'Invalid page or pageSize' });
    }

    // Calculate the number of documents to skip to reach the requested page
    const skip = (pageNumber - 1) * pageSizeNumber;

    // Query the database to get a page of documents
    const result = await QuestionModel.find()
      .skip(skip)
      .limit(pageSizeNumber);

    // Count the total number of documents (for pagination controls)
    const totalDocuments = await QuestionModel.countDocuments();
    res.status(200).json({
      questions: result,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalDocuments / pageSizeNumber),
      pageSize: pageSizeNumber,
      totalDocuments: totalDocuments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function getMaxQuestionId(req, res) {
  try {
    const maxQuestion = await QuestionModel.findOne({}, {}, { sort: { id: -1 } });
    const maxQuestionId = maxQuestion ? maxQuestion.id : 0; // Return 0 if ther is no question
    res.status(200).json({ maxQuestionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function addQuestion(req, res) {
  try {
    const { id, title, description, categories, complexity } = req.body;
    
    if (!id || !title || !description || !categories || !complexity) {
      return res.status(401).json({ error: 'Empty params given' });
    }

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

    res.status(201).json(deletedQuestion); // Respond with the deleted document
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { 
  getQuestions,
  getMaxQuestionId,
  addQuestion,
  deleteQuestion
};
