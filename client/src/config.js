const config = {
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.rubik.school/sticker-app'  // Замените на ваш продакшн URL
    : 'http://localhost:5000/api'
};

export default config; 