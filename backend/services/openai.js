const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateChatResponse = async (messages, systemPrompt) => {
  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: formattedMessages,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

const generateAnalysis = async (text, systemPrompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze the following text according to the system prompt:\n\n${text}` }
      ],
      response_format: { type: 'json_object' } // Expecting JSON response based on our prompt
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw error;
  }
};

const generateChatStream = async (messages, systemPrompt) => {
  try {
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    return await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: formattedMessages,
      stream: true,
    });
  } catch (error) {
    console.error('OpenAI Stream API Error:', error);
    throw error;
  }
};

module.exports = {
  openai,
  generateChatResponse,
  generateChatStream,
  generateAnalysis
};
