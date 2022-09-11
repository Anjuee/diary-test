'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
    async list() {
        const { ctx, app } = this;
        try {
            let user_id;
            // 通过 token 解析，拿到 user_id
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return
            user_id = decode.id
            // 拿到当前用户的账单列表
            const list = await ctx.service.type.list(user_id)

            // 返回数据
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    list: list || [] // 格式化后，并且经过分页处理的数据
                }
            }
        } catch {
            ctx.body = {
                code: 500,
                msg: '系统错误',
                data: null
            }
        }
    }
}

module.exports = TypeController;