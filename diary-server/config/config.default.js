/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1655019008600_3165';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'], // 配置白名单
  };

  config.view = {
    mapping: { '.html': 'ejs' }  //左边写成.html后缀，会自动渲染.html文件
  };

  config.mysql = {
    // 单数据库信息配置
    client: {
      host: 'localhost', // host
      port: '3306', // 端口号
      user: 'root', // 用户名
      password: 'nulifendou123',
      database: 'diary_server', // 新建的数据库名称
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  config.jwt = {
    secret: 'Anjuee',
  };

  config.multipart = {
    mode: 'file'
  };

  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };


  // 定义头像文件的上传地址
  const userConfig = {
    uploadDir: 'app/public/upload'
  };

  return {
    ...config,
    ...userConfig,
  };
};
