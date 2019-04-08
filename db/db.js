import mongoose from 'mongoose'
import config from '../config'
import chalk from 'chalk'

mongoose.connect(config.dbHost, {useNewUrlParser: true})

const db = mongoose.connection

db.once('open', () => {
  console.log(chalk.green('数据库连接成功'));
})

db.on('error', (error) => {
  console.error(chalk.red('数据库连接失败，信息：'+ error));
})

db.on('close', () => {
  console.log(chalk.red('数据库断开，正在重新连接'));
  mongoose.connect(config.dbHost, {server:{auto_reconnect:true}})
})

export default db