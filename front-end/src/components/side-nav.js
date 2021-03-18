// TODO: Fix this gigantic pain in the ass
import React from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaGem, FaList, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import 'react-pro-sidebar/dist/css/styles.css';

const SideNav = () => {
  return (
    <ProSidebar
      image={false}
      breakPoint="md"
    >
      <SidebarHeader>
        <div
          style={{
            padding: '24px',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: 14,
            letterSpacing: '1px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Header
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem
            icon={<FaTachometerAlt />}
          >
            Dashboard
          </MenuItem>
          <MenuItem icon={<FaGem />}> Components</MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            title="Item 1"
            icon={<FaRegLaughWink />}
          >
            <MenuItem>Sub Item 1</MenuItem>
            <MenuItem>Sub Item 2</MenuItem>
            <MenuItem>Sub Item 3</MenuItem>
          </SubMenu>
          <SubMenu
            title="Item 2"
            icon={<FaHeart />}
          >
            <MenuItem>Sub Item 1</MenuItem>
            <MenuItem>Sub Item 2</MenuItem>
            <MenuItem>Sub Item 3</MenuItem>
          </SubMenu>
          <SubMenu title="Item 3" icon={<FaList />}>
            <MenuItem>Sub Item 1</MenuItem>
            <MenuItem>Sub Item 2</MenuItem>
            <SubMenu title="Sub Menu 1">
              <MenuItem>Sub Item 1</MenuItem>
              <MenuItem>Sub Item 2</MenuItem>
              <SubMenu title="Sub Menu 2">
                <MenuItem>Sub Item 1</MenuItem>
                <MenuItem>Sub Item 2</MenuItem>
                <MenuItem>Sub Item 3</MenuItem>
              </SubMenu>
            </SubMenu>
          </SubMenu>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default SideNav;