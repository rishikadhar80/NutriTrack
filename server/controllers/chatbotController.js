const { getChatResponse } = require('../services/chatbotService');

// @desc    Chat with AI
// @route   POST /api/chatbot
exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const response = await getChatResponse(message, req.user);
    res.json({ success: true, data: { response } });
  } catch (error) {
    next(error);
  }
};
