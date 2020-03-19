import React from "react";
import common from "./common.less";
import { connect } from "dva";
import { Avatar } from "antd";
import queryString from "query-string";
import { Menu, Dropdown, Icon } from "antd";

const Header = ({ logOut, app, dispatch }) => {


  const { collapsed } = app;
  const menu = (
    <Menu style={{ marginTop: "15px" }}>
      {/* <Menu.Item>
        <Link to="/changePassword">修改密码</Link>
      </Menu.Item> */}
      <Menu.Item>
        <p onClick={logOut}>退出登录</p>
      </Menu.Item>
    </Menu>
  );
  const userinfo = queryString.parse(window.localStorage.getItem("userinfo") || '{}');
  const name = userinfo.name || "轻松筹";
  const avatar = userinfo.avatar;
  const onToggleCollapsed = () => {
    dispatch({
      type: 'app/toggleCollapsed',
      payload: !collapsed
    })
  }
  return (
    <header className={!collapsed ? common.header : (common.header + ' ' + common.headerCollapsed)}>
      <div className={common.collapse_btn} onClick={onToggleCollapsed}>
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} style={{ color: '#252F33 ' }} />
      </div>
      <div className={common.avatar}>
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className={common.user}>
              <Avatar size="large" src={avatar && avatar !== '' ? avatar : require('@assets/images/222.jpeg')} />
            <div>
              <p style={{ marginLeft: "8px" }}> {name}</p>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
export default connect(({ app }) => ({ app }))(Header);
