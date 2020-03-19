import React, { useEffect } from "react";
import { Menu, Icon } from "antd";
import common from "./common.less";
import { menuConfig, config } from "@config";

import { canShowMenu } from '@utils/utils';
import { routerRedux, Link } from "dva/router";
import { connect } from "dva";
const SubMenu = Menu.SubMenu;

let timer = null; //防抖
const Sider = ({ dispatch, app }) => {
  const { menu, collapsed } = app;
  const { selectedType, selectedItem } = menu;

  useEffect(() => {
    if (window.document.body.clientWidth < 1344) {
      dispatch({
        type: 'app/toggleCollapsed',
        payload: true
      })
    }
    // 窗口大小变化时
    window.onresize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.document.body.clientWidth < 1344) {
          dispatch({
            type: 'app/toggleCollapsed',
            payload: true
          })
        } else {
          dispatch({
            type: 'app/toggleCollapsed',
            payload: false
          })
        }
      }, 400)
    }
    //hooks等待本组件销毁时调用，移除计时器和window.onresize事件
    return () => {
      clearTimeout(timer);
      window.onresize = null
    }
  }, [dispatch])

  const linkTo = () => {
    dispatch(routerRedux.push('/order/list'))
  }

  const clickItem = ({ item, key, keyPath }) => {
    dispatch({
      type: "app/siderSlected"
    });
  };

  const menuCom = (type, typeItem) => {
    let com = undefined;
    if (type) {
      switch (type) {
        case 1:
          com = (
            <SubMenu
              key={typeItem.key}
              title={
                <span>
                  <Icon type={typeItem.icon} />
                  <span>{typeItem.name}</span>
                </span>
              }
            >
              {typeItem.items.map(item => (
                canShowMenu(item.id, 2) &&
                <Menu.Item key={typeItem.key + item.path} className={common.item}>
                  <Link to={typeItem.key + item.path}>
                    {item.title}
                  </Link>
                </Menu.Item>
              ))}
            </SubMenu>
          );
          break;
        case 2:
          com = (
            <Menu.Item  key={typeItem.key}>
              <Link to={typeItem.path}>
                <Icon type={typeItem.icon} />
                <span>{typeItem.name}</span>
              </Link>
            </Menu.Item>
          )
          break;
        default:
          break;

      }
    }
    return com;

  }
  return (
    <div
      className={!collapsed ? common.sider : (common.sider + ' ' + common.siderCollapsed)}
    >
      <div onClick={linkTo} className={common.logo}>
        <img alt="" src={config.logo} />
        <p className={!collapsed ? '' : common.title}>{config.name}</p>
      </div>
      <Menu
        inlineCollapsed={collapsed}
        // style={{ width: 210 }}
        defaultOpenKeys={selectedType}
        // selectedKeys={selectedItem}
        defaultSelectedKeys={selectedItem}
        mode="inline"
        theme="dark"
        onClick={clickItem}
      >
        {
          menuConfig.map(typeItem => (
            menuCom(canShowMenu(typeItem, 1), typeItem))
          )
        }
      </Menu>
    </div>
  )
}

export default connect(({ loading, app }) => ({ loading, app }))(Sider);
