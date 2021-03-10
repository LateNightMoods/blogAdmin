import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, MenuProps } from 'antd';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import {
  Route, Switch, useHistory, useLocation
} from 'react-router-dom';
import navs, { Nav } from '../../config/navs';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout

function App() {
  const [breadcrumbs, setBreadcrumbs] = useState<Nav[]>([])
  const [collapsed, setCollapsed] = useState(false)
  const history = useHistory()
  const location = useLocation()
  
  useEffect(() => {
    const { pathname } = location
    const newBreadcrumbs:Nav[] = []
    navs.some(nav => {
      if (new RegExp('^' + nav.url).test(pathname)) {
        newBreadcrumbs.push(nav)
        if (nav.childrens) {
          nav.childrens.some(item => {
            if (new RegExp('^' + nav.url + item.url).test(pathname)) {
              newBreadcrumbs.push(item)
              return true
            }
          })
        }
        return true
      }
    })
    setBreadcrumbs(newBreadcrumbs)
  }, [location])

  const leftMenuProps:MenuProps = {
    inlineCollapsed: collapsed,
    onClick: ({ keyPath }) => {
      let len = keyPath.length
      let url = ''
      while(len--) {
        const path = keyPath[len]
        url += path
      }
      history.push(url)
    }
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <Button type="primary" onClick={() => setCollapsed(!collapsed)}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu theme="dark" mode="horizontal" style={{ display: 'inline-block', marginLeft: '50px' }} onClick={leftMenuProps.onClick}>
          <Menu.Item key="/article/add">发布文章</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider collapsed={collapsed} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['/article']}
            defaultOpenKeys={['/article']}
            style={{ height: '100%', borderRight: 0 }}
            {...leftMenuProps}
          >
            {
              navs.map(nav => {
                return nav.childrens ?
                <SubMenu key={nav.url} icon={<UserOutlined />} title={nav.name}>
                  {nav.childrens && nav.childrens.map(item => (
                    <Menu.Item key={item.url}>{ item.name }</Menu.Item>
                  ))}
                </SubMenu>
                : <Menu.Item key={nav.url} icon={<UserOutlined />}>{ nav.name }</Menu.Item>
              })
            }
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbs.map(item => (
              <Breadcrumb.Item key={item.url}>{item.name}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              margin: 0,
              minHeight: 280,
              overflowY: 'auto'
            }}
          >
            <RouterRender />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

function RouterRender() {
  return (
    <Switch>
    {
      navs.map(nav => {
        return nav.component ? <Route key={nav.url} path={nav.url} component={nav.component()} /> :
         nav.childrens && nav.childrens.map(item => 
          {return item.component ?
            <Route key={nav.url + item.url} path={nav.url + item.url} component={item.component()} />
            :
            <Route key={nav.url + item.url} path={nav.url + item.url} />
          }
        )
      })
    }
    </Switch>
  )
}

export default App
