const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateAIResponse = async (prompt, jsonMode = true) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
    });

    const response = chatCompletion.choices[0]?.message?.content || '';

    if (jsonMode) {
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/) || response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      return JSON.parse(response);
    }
    return response;
  } catch (error) {
    console.error('Groq AI Error:', error.message);
    throw new Error('AI service temporarily unavailable');
  }
};

module.exports = { generateAIResponse };
