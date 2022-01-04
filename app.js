const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken');
const api = require('./routes/api')
const koaRouter = require('koa-router')
const router = koaRouter()
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(async function(ctx, next){  //  如果JWT验证失败，返回验证失败信息
  try {
    await next();
  } catch (err) {
    if (401 === err.status) {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        token: null,
        message: '未登录'
      };
    } else {
      throw err;
    }
  }
});

// logger
app.use(async (ctx, next) => {
	const start = new Date()
	await next()
	const ms = new Date() - start
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
router.use('/api', jwt({   //jwt token验证
	secret: 'ht'
}).unless({
    path:[/^\/api\/login/, /^\/api\/register/, /^\/api\/getMessage/]
}), async function(ctx, next) { 
	let token = ctx.request.header.authorization;
	console.log(token)
	if(!token){
		await next();
		return;
	}
	token = token.substring(token.indexOf(' ') + 1, token.length)
	ctx.session = { 
		'user_id': jsonwebtoken.verify(token, 'ht').id
	};
	await next();
}, api.routes())


app.use(router.routes()); // 将路由规则挂载到Koa上。
// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
});

module.exports = app
