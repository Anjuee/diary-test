'use strict';

const Service = require('egg').Service;

class BillService extends Service {
    // 获取账单列表
    async list(id) {
        const { app } = this;
        const QUERY_STR = 'id, name, type';
        let sql = `select ${QUERY_STR} from type where user_id = ${id}`;
        try {
            const result = await app.mysql.query(sql);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = BillService;