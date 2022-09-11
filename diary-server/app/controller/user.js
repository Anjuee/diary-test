'use strict';

const Controller = require('egg').Controller;
// 默认头像，放在 user.js 的最外，部避免重复声明。
const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';

class UserController extends Controller {
    async register() {
        const { ctx } = this;
        // 获取注册用户名和秘密
        const { username, password } = ctx.request.body;
        // 判断是否输入了完整的账号密码
        if (!username || !password) {
            ctx.body = {
                code: 500,
                msg: '账号密码不能为空',
                data: null
            }
            return;
        }
        // 根据输入的用户信息前往数据库进行查询
        const userInfo = await ctx.service.user.getUserByName(username) // 获取用户信息
        // 如果已经存在相关的用户信息，返回用户已注册
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return
        }
        // 如果不存在相关的注册信息，则进行用户的注册
        const result = await ctx.service.user.register({
            username,
            password,
            signature: '世界和平。',
            avatar: defaultAvatar
        });
        if (result) {
            // 如果存在result，则证明向数据库写入信息成功
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            // 如果不存在result，则证明注册失败
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }

    async login() {
        // 额外获取app，用于调用挂载的插件
        const { ctx, app } = this;
        const { username, password } = ctx.request.body;
        // 根据用户名，在数据库查找相对应的id操作
        const userInfo = await ctx.service.user.getUserByName(username);
        // 没找到说明没有该用户
        if (!userInfo || !userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
            }
            return;
        }
        // 找到用户，并且判断输入密码与数据库中用户密码。
        if (userInfo && password != userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
            }
            return;
        }
        // 利用app-jwt对token进行加密
        // app.jwt.sign 的第一个参数传入需要加密的对象，第二个参数传入config中配置的加密字符串
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // token 有效期为 24 小时
        }, app.config.jwt.secret);
        // 加密成功之后，需要向客户端返回token，客户端获取之后能存在localStorage中，在写一次发送请求时携带
        ctx.body = {
            code: 200,
            message: '登录成功',
            data: {
                token
            },
        };
    }

    async getUserInfo() {
        const { ctx, app } = this;
        try {
            // 从http的authorization请求头中获取localStorage中存储的token
            const token = ctx.request.header.authorization;
            // 通过 app.jwt.verify 解析 token 内的用户信息
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            // 通过 getUserByName 方法，以用户名 decode.username 为参数，从数据库获取到该用户名下的相关信息
            const userInfo = await ctx.service.user.getUserByName(decode.username)
            // userInfo 中应该有密码信息，所以我们指定下面四项返回给客户端
            ctx.body = {
                code: 200,
                msg: '请求成功',
                data: {
                    id: userInfo.id,
                    username: userInfo.username,
                    signature: userInfo.signature || '',
                    avatar: userInfo.avatar || defaultAvatar
                }
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '请求失败',
                data: null,
            }
        }
    }

    // 修改用户信息
    async editUserInfo() {
        const { ctx, app } = this;
        // 通过 post 请求，在请求体中获取签名字段 signature
        const { signature = '', avatar = '' } = ctx.request.body
        try {
            let user_id;
            const token = ctx.request.header.authorization;
            const decode = await app.jwt.verify(token, app.config.jwt.secret);
            if (!decode) return;
            user_id = decode.id
            // 通过 username 查找 userInfo 完整信息
            const userInfo = await ctx.service.user.getUserByName(decode.username)
            // 通过 service 方法 editUserInfo 修改 signature 信息。
            const result = await ctx.service.user.editUserInfo({
                ...userInfo,
                signature,
                avatar
            });
            ctx.body = {
                code: 200,
                msg: '修改成功',
                data: {
                    id: user_id,
                    signature,
                    username: userInfo.username,
                    avatar
                }
            }
        } catch (error) {
            ctx.body = {
                code: 500,
                msg: '修改失败',
                data: null
            }
        }
    }
}

module.exports = UserController;