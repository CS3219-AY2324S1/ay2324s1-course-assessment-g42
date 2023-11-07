require("../mongo-db");
const QuestionModel = require('../models/questions.js');

async function getQuestions(req, res) {
  try {
    const { page, pageSize, complexity, category, title } = req.body || { page: 1, pageSize: 10 };

    // Ensure the values are integers and handle any validation as needed
    const pageNumber = parseInt(page);
    const pageSizeNumber = parseInt(pageSize);
    if (isNaN(pageNumber) || isNaN(pageSizeNumber)) {
      return res.status(400).json({ error: 'Invalid page or pageSize' });
    }

    // Calculate the number of documents to skip to reach the requested page
    const skip = (pageNumber - 1) * pageSizeNumber;

    // Create a filter object based on the complexityFilter
    const filter = {};
    if (complexity) {
      filter.complexity = complexity;
    }
    if (category) {
      filter.categories = { $in: [category] };
    }
    if (title) {
      const sanitizedTitle = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape special characters
      filter.title = { $regex: new RegExp(sanitizedTitle, 'i') }; // i for case-insensitive
    }

    // Query the database to get a page of documents
    const result = await QuestionModel.find(filter)
      .skip(skip)
      .limit(pageSizeNumber);

    // Count the total number of documents (for pagination controls)
    const totalDocuments = await QuestionModel.countDocuments(filter);
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

async function getQuestionById(req, res) {
  try {
    const { id } = req.body;
    const question = await QuestionModel.findOne({ id: id });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question); // Respond with found document
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
    if (err.code === 11000) {
      // Handle duplicate key error
      res.status(409).json({ error: 'Duplicate key error' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'An error occurred' });
    }
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

async function getQuestionByComplexity(req, res) {
  try {
    const { complexity } = req.body;

    if (!(complexity == 'Easy' || complexity == 'Medium' || complexity == 'Hard')) {
      return(res).status(402).json({ message: 'Invalid complexity given' });
    }
    // Find questions with the specified complexity
    const questions = await QuestionModel.find({ complexity: complexity });

    if (questions.length === 0) {
      return res.status(403).json({ message: 'No questions found for the specified complexity.' });
    }

    // Generate a random index to select a question
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    res.status(200).json(randomQuestion.id); //Respond with random question id
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occured '});
  }
}

module.exports = { 
  getQuestions,
  getQuestionById,
  getMaxQuestionId,
  addQuestion,
  deleteQuestion,
  getQuestionByComplexity
};
