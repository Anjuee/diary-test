import React from "react";
import s from "./style.module.less";
import { useState } from "react";
import dayjs from "dayjs";
import { get, LOAD_STATE, REFRESH_STATE } from "../../utils";

const Home = () => {
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);

    const [currentType, setCurrentType] = useState({});
    const [currentTime, setCurremtTime] = useState(dayjs().format('YYYY-MM'));

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [list, setList] = useState([]);

    const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
    const [loading, setLoading] = useState(LOAD_STATE.normal);

    const getBillList = async () => {
        const { data } = await get(`/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentType.id || 'all'}`);
        if (page === 1) {
            setList(data.list);
        } else {
            setList(list.concat(data.list));
        }
        setTotalExpense(data.totalExpense.toFixed(2));
        setTotalIncome(data.totalIncome.toFixed(2));
        setTotalPage(data.totalPage);
        setRefreshing(REFRESH_STATE.success);
        setLoading(LOAD_STATE.success);
    }

    return (
        <div className={s.home}>
            <div className={s.header}>
                <div className={s.data}>
                    <span className={s.expense}></span>
                    <span className={s.income}></span>
                </div>
                <div className={s.select}>
                    <div className={s.left} onClick={() => { }}>
                        <span className={s.type}></span>
                    </div>
                    <div className={s.right} onClick={() => { }}>
                        <span className={s.time}></span>
                    </div>
                </div>
            </div>
            <div className={s.content}>

            </div>
        </div>
    )
}

export default Home;