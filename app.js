import express from 'express'
import router from './routes'
import config from './config'
import bodyParser from 'body-parser'
import './db/db'
import path from 'path'

const app = express()

// 公开 public 目录
app.use('/public/', express.static(path.join(__dirname, './public/')));

// 配置 body-parser
app.use(bodyParser.urlencoded({ extended:false }))
app.use(bodyParser.json())

// 解决前端跨域
app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
	res.header("X-Powered-By", '3.2.1')
	if (req.method == 'OPTIONS') {
	  	res.sendStatus(200);
	} else {
	    next();
	}
});

router(app)

app.listen(config.port, () => {
  console.log(`the server has already running at http://${config.host}:${config.port}`);
})