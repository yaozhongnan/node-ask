export default  {
  port: 5000,   // 端口号
  host: 'localhost',    // 开发地址
  public_host: '47.99.74.241',  
  dbHost: 'mongodb://127.0.0.1:27017/wd_app',   // 数据库地址
  secret: 'THATISASECRET',    // token 密钥
  overdue_time: 1000 * 60 * 60 * 24,    // token过期时间，24小时（单位/毫秒）
  limit: 12,    // 一页的条数
}