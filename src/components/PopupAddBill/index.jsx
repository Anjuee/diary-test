import React, { forwardRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import s from './style.module.less';
import cx from 'classnames';
import dayjs from 'dayjs';
import PopupDate from '../PopupDate'
import CustomIcon from '../CustomIcon';
import { get, post, typeMap } from '@/utils';

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
    // 内部控制弹窗显示隐藏。
    const [show, setShow] = useState(false)

    // 选择输入的内容
    const [payType, setPayType] = useState('expense'); // 支出或收入类型
    const [currentType, setCurrentType] = useState({}); // 当前选中账单类型
    const [date, setDate] = useState(new Date()); // 日期
    const [expense, setExpense] = useState([]); // 支出类型数组
    const [income, setIncome] = useState([]); // 收入类型数组

    // 手动输入相关内容
    const [amount, setAmount] = useState(''); // 账单价格
    const [remark, setRemark] = useState(''); // 备注
    const [showRemark, setShowRemark] = useState(false); // 备注输入框展示控制

    // 控制日期弹窗的弹出
    const dateRef = useRef();

    if (ref) {
        ref.current = {
            show: () => { setShow(true) },
            close: () => { setShow(false) }
        }
    };
    // 设置账单类型（收入/支出）
    const changeType = (type) => {
        setPayType(type);
    };

    // 设置日期，作为props传递给date组件
    const selectDate = (val) => {
        setDate(val);
    };

    // 获取数字键盘的键值并做相应的操作
    const handleMoney = (value) => {
        value = String(value)
        if (value === 'delete') {
            let _amount = amount.slice(0, amount.length - 1);
            setAmount(_amount);
            return;
        }
        if (value === 'ok') {
            addBill();
            return;
        }
        // 当输入的值为 '.' 且 已经存在 '.'，则不让其继续字符串相加。
        if (value == '.' && amount.includes('.')) return;
        // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
        if (value != '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return;
        setAmount(amount + value);
    }

    // 添加账单
    const addBill = async () => {
        if (!amount) {
            Toast.show('请输入具体金额');
            return;
        }
        const params = {
            amount: Number(amount).toFixed(2), // 账单金额小数点后保留两位
            type_id: currentType.id, // 账单种类id
            type_name: currentType.name, // 账单种类名称
            date: dayjs(date).unix() * 1000, // 日期传时间戳
            pay_type: payType === 'expense' ? 1 : 2, // 账单类型传 1 或 2
            remark: remark || '' // 备注
        };
        if (detail.id) {
            // 修改账单
            params.id = detail.id;
            const result = await post('/api/bill/update', params);
            Toast.show('修改成功');
        } else {
            // 新增账单
            const result = await post('/api/bill/add', params);
            setAmount('');
            setPayType('expense');
            setCurrentType(expense[0]);
            setDate(new Date());
            setRemark('');
            Toast.show('添加成功');
        }
        setShow(false);
        if (onReload) onReload();
    }


    useEffect(async () => {
        const { data: { list } } = await get('/api/type/list');
        const _expense = list.filter(i => i.type == 1); // 支出类型
        const _income = list.filter(i => i.type == 2); // 收入类型
        setExpense(_expense);
        setIncome(_income);
        // 没有 id 的情况下，说明是新建账单。
        if (!detail.id) {
            setCurrentType(_expense[0]);
        };
    }, []);

    useEffect(() => {
        if (detail.id) {
            setPayType(detail.pay_type == 1 ? 'expense' : 'income');
            setCurrentType({
                id: detail.type_id,
                name: detail.type_name
            });
            setRemark(detail.remark);
            setAmount(detail.amount);
            setDate(dayjs(Number(detail.date)).$d);
        }
    }, [detail]);

    return <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >
        <div className={s.addWrap}>
            {/* 右上角关闭弹窗 */}
            <header className={s.header}>
                <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong" /></span>
            </header>
            {/* 「收入」和「支出」类型切换 */}
            <div className={s.filter}>
                <div className={s.type}>
                    <span onClick={() => changeType('expense')} className={cx({ [s.expense]: true, [s.active]: payType == 'expense' })}>支出</span>
                    <span onClick={() => changeType('income')} className={cx({ [s.income]: true, [s.active]: payType == 'income' })}>收入</span>
                </div>
                <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
                    {dayjs(date).format('MM-DD')}
                    <Icon className={s.arrow} type="arrow-bottom" />
                </div>
            </div>
            <div className={s.money}>
                <span className={s.sufix}>¥</span>
                <span className={cx(s.amount, s.animation)}>{amount}</span>
            </div>
            <div className={s.typeWarp}>
                <div className={s.typeBody}>
                    {
                        (payType == 'expense' ? expense : income).map(item =>
                            <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                                <span className={cx({ [s.iconfontWrap]: true, [s.expense]: payType === 'expense', [s.income]: payType === 'income', [s.active]: currentType.id === item.id })}>
                                    <CustomIcon className={s.iconfont} type={typeMap[item.id].icon} />
                                </span>
                                <span>{item.name}</span>
                            </div>)
                    }
                </div>
            </div>
            <div className={s.remark}>
                {
                    showRemark ? <Input
                        autoHeight
                        showLength
                        maxLength={50}
                        type="text"
                        rows={3}
                        value={remark}
                        placeholder="请输入备注信息"
                        onChange={(val) => setRemark(val)}
                        onBlur={() => setShowRemark(false)}
                    /> : <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
                }
            </div>
            <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
            <PopupDate ref={dateRef} onSelect={selectDate} />
        </div>
    </Popup>
})

PopupAddBill.propTypes = {
    detail: PropTypes.object,
    onReload: PropTypes.func,
}

export default PopupAddBill;