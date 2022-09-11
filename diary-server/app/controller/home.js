'use strict';
// 用于解析用户的输入，处理后返回相应的结果。
// 通过请求路径将用户的请求基于 method 和 URL 分发到对应的 Controller 上， Controller 要做的事情就是响应用户的诉求
// 0. 例如，想拿到A用户的个人信息，
// 1. 请求中就会携带请求携带的A用户的id参数发送到相应的Controller里
// 2. Controller会坐想要的逻辑处理，从数据库里获取指定用户的个人信息

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ctx.render 默认会去 view 文件夹寻找 index.html，这是 Egg 约定好的。
    await ctx.render('index.html', {
      title: '服务器已经启动', // 将 title 传入 index.html
    });
  }
}
module.exports = HomeController;
