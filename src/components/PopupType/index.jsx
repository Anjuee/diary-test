import React, { forwardRef, useEffect, useState } from 'react';
import s from './style.module.less';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'zarm';
import cx from 'classnames';
import { get } from '@/utils';

const PopupType = forwardRef(({ onSelect }, ref) => {
    const [show, setShow] = useState(false); // 组件的显示和隐藏
    const [active, setActive] = useState('all'); // 激活的 type
    const [expense, setExpense] = useState([]); // 支出类型标签
    const [income, setIncome] = useState([]); // 收入类型标签

    // 弹窗出现时加载所有的收支类型，并更新相应的状态值
    useEffect(async () => {
        const { data: { list } } = await get('/api/type/list');
        setExpense(list.filter(i => i.type == 1));
        setIncome(list.filter(i => i.type == 2));
    }, []);

    // 通过ref暴露父组件对子组件的控制方法
    if (ref) {
        ref.current = {
            show: () => { setShow(true) },
            close: () => { setShow(false) }
        }
    };

    // 选择类型回调
    const choseType = (item) => {
        setActive(item.id);
        console.log(item);
        setShow(false);
        onSelect(item);
    };

    return <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
    >
        <div className={s.popupType}>
            <div className={s.header}>
                请选择类型
                <Icon type="wrong" className={s.cross} onClick={() => setShow(false)} />
            </div>
            <div className={s.content}>
                <div onClick={() => choseType({ id: 'all' })} className={cx({ [s.all]: true, [s.active]: active === 'all' })}>全部类型</div>
                <div className={s.title}>支出</div>
                <div className={s.expenseWrap}>
                    {
                        expense.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active === item.id })} >{item.name}</p>)
                    }
                </div>
                <div className={s.title}>收入</div>
                <div className={s.incomeWrap}>
                    {
                        income.map((item, index) => <p key={index} onClick={() => choseType(item)} className={cx({ [s.active]: active === item.id })} >{item.name}</p>)
                    }
                </div>
            </div>
        </div>
    </Popup>
});

PopupType.propTypes = {
    onSelect: PropTypes.func,
}

export default PopupType;