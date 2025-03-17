const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://your-production-api-url.com/api'  // Замените на ваш продакшн URL
    : 'http://localhost:5000/api'
};

export default config; 