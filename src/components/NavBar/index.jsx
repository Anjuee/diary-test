import React, { useState } from 'react';
import Proptypes from 'prop-types';
import { TabBar } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';


const NavBar = ({ showNav }) => {
    const [activekey, setActivekey] = useState('/');
    const navigate = useNavigate();

    const changeTab = (path) => {
        setActivekey(path);
        navigate(path);
    }

    return (
        <TabBar visible={showNav} activeKey={activekey} onChange={changeTab}>
            <TabBar.Item itemKey={'/'} title='账单' icon={<CustomIcon type='zhangdan' />} />
            <TabBar.Item itemKey={'/data'} title='统计' icon={<CustomIcon type='tongji' />} />
            <TabBar.Item itemKey={'/user'} title='我的' icon={<CustomIcon type='wode' />} />
        </TabBar>
    )

}
NavBar.proptypes = {
    showNav: Proptypes.bool,
}

export default NavBar;