import axios from 'axios'

export default defineEventHandler(async (event) => {
  const targetTicker = decodeURIComponent(getQuery(event).ticker)
  
  try {
    const { data } = await axios.get(`https://tsanghi.com/api/fin/stock/XSHG/daily?token=273f9fb332a8473cb9238c2c6e519e82&&start_date=2024-09-26&ticker=${targetTicker}`)
    return data
  } catch (error) {
    console.error('代理请求失败:', error)
    return createError({ 
      statusCode: error.response?.status || 500,
      message: error.message 
    })
  }
})