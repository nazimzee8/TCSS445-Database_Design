import Header from './header';
import React from "react";

//Renders navbar
const layoutStyle = {
    margin: 0,
    padding: 0,
    border: '1px solid #DDD',
    //background: 'gray'
};

const Layout = props => (
    <div style={layoutStyle}>
        <Header />
        {props.children}
    </div>
);

export default Layout;