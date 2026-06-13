const { generateChatResponse } = require('./services/openai');

async function test() {
  try {
    const messages = [{ role: 'user', content: 'Hello' }];
    const response = await generateChatResponse(messages, 'You are a helpful assistant.');
    console.log('AI Response:', response);
  } catch (error) {
    console.error('Chat error:', error.message);
    if (error.response) {
      console.error(error.response.data);
    }
  }
}

test();
