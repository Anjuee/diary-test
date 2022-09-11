import React, { useEffect, useState } from 'react';
import { Routes, useLocation, useRoutes, } from "react-router-dom";
import routes from '@/router';
import { ConfigProvider } from 'zarm'
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
import NavBar from './components/NavBar';



function App() {
  const location = useLocation();
  const { pathname } = location;
  const needNav = ['/', '/data', '/user'];
  const [shouNav, setShowNav] = useState(false);

  const element = useRoutes(routes);

  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);


  return (
    <ConfigProvider primaryColor='#007fff' locale={zhCN}>
      <>
        {element}
        <NavBar showNav={shouNav} />
      </>
    </ConfigProvider>
  )
}
export default App;