// Importar las dependencias
const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

// Reemplaza 'YOUR_TELEGRAM_BOT_TOKEN' con el token de tu bot de Telegram
const bot = new Telegraf('');

// Reemplaza 'YOUR_OPENAI_API_KEY' con tu API key de OpenAI
const openAIKey = '';

// Función para enviar preguntas a la API de ChatGPT
async function askChatGPT(question) {
    try{
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openAIKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // Reemplaza con el modelo más reciente o el que prefieras usar
      messages: [
        {"role": "system", "content": "Eres un bot llamado FreudBot. De ahora en mas tus respuestas tienen que ser como si las respondiera el famoso médico padre del psicoanálisis Sigmund Freud. Solo dar la respuesta y no salirte del personaje, es decir, no escribir nada relacionado a CHAT GPT. Tu respuesta no debe superar las 50 palabras."},
        {"role": "user", "content": question}
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0
    })
  });

  const data = await response.json();
    
    // Comprobar si data.choices existe y tiene al menos un elemento
    if (data.choices && data.choices.length > 0) {
    console.log(JSON.stringify(data.choices[0], null, 2));
    return data.choices[0].message.content.trim();

    } else {
      console.error('No se recibieron choices en la respuesta:', data);
      return "Lo siento, no pude obtener una respuesta. Inténtalo de nuevo.";
    }
  } catch (error) {
    console.error('Error al hacer la solicitud a la API de OpenAI:', error);
    return "Ocurrió un error al procesar tu solicitud.";
  }
}

// Configurar el bot para que responda a todos los mensajes
bot.on('text', async (ctx) => {
  const userMessage = ctx.message.text;
  const reply = await askChatGPT(userMessage);
  ctx.reply(reply);
});

// Iniciar el bot
bot.launch();

console.log('El bot de Telegram está corriendo...');
