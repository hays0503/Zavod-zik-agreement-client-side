import {
  TeamOutlined
} from '@ant-design/icons'
import { Divider, Layout, Menu } from 'antd'
import React from 'react'
import { NavLink, Redirect, Route, useLocation, withRouter } from 'react-router-dom'
import { useUser } from '../../core/functions'
import Header1 from '../../core/Header1'

import UsersPage from './pages/UsersPage'
import DocumentStatusesPage from './pages/DocumentStatusesPage'
import DocumentRoutesPage from './pages/DocumentRoutesPage'
import DocumentPositionsPage from './pages/PositionsPage'
import FormSettingsPage from './pages/FormSettingsPage'

const { Content, Sider } = Layout
// const [
//    ttt,
//    { loading: mutationLoading, error: mutationError, data },
// ] = useMutation(GET_GREETING);
// useEffect(() => {
//    ttt();
// }, []);
// console.log(mutationLoading);
// console.log(mutationError);
// console.log(data);

const AdminPanel = (props) => {
  const { pathname } = useLocation()
  const user = useUser()

  const path = props.location.pathname.split('/').slice(1)
  if (pathname === '/admin/' || pathname === '/admin') {
    if (user.username) {
      return <Redirect to='/admin/registration'/>
    }
    if (user.username) {
      return <Redirect to='/admin/positions-page' />
    }
    if (user.username) {
      return <Redirect to='/admin/document-statuses-page'/>
    }
    if (user.username) {
      return <Redirect to='/admin/document-routes-page' />
    }
    if (user.username) {
      return <Redirect to='/admin/forms-settings-page' />
    }
  }
  console.log(path, pathname)

  return (
        <Layout className="main-layout">
            <Header1 title={'Модуль Администратора'} user={user}/>
            <Layout>
                <Sider theme="dark"
                       breakpoint="lg"
                       collapsedWidth="0"
                       className='ant-layout-sider'
                >
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={pathname} style={{ height: '100%' }} className="adminSider">
                        <Divider style={{ position: 'absolute', margin: 0, top: 0 }}/>
                        <Menu.Item style={{ marginTop: 2, marginBottom: 2 }} key="/admin/registration" icon={<TeamOutlined />}><NavLink to="/admin/registration">Пользователи</NavLink></Menu.Item>
                        <Divider style={{ margin: 0 }} />
                        <Menu.Item style={{ marginTop: 2, marginBottom: 2 }} key="/admin/positions-page" icon={<TeamOutlined />}><NavLink to="/admin/positions-page">Должности</NavLink></Menu.Item>
                        <Divider style={{ margin: 0 }} />
                        <Menu.Item style={{ marginTop: 2, marginBottom: 2 }} key="/admin/document-statuses-page" icon={<TeamOutlined />}><NavLink to="/admin/document-statuses-page">Статусы документов</NavLink></Menu.Item>
                        <Divider style={{ margin: 0 }} />
                        <Menu.Item style={{ marginTop: 2, marginBottom: 2 }} key="/admin/document-routes-page" icon={<TeamOutlined />}><NavLink to="/admin/document-routes-page">Маршруты документов</NavLink></Menu.Item>
                        <Divider style={{ margin: 0 }} />
                        <Menu.Item style={{ marginTop: 2, marginBottom: 2 }} key="/admin/forms-settings-page" icon={<TeamOutlined />}><NavLink to="/admin/forms-settings-page">Настройки форм</NavLink></Menu.Item>
                        <Divider style={{ margin: 0 }} />
                        <Divider style={{ position: 'absolute', margin: 0, bottom: 0 }}/>
                    </Menu>
                </Sider>
                <Layout className="content-layout">
                <Content>
                    <div className="site-layout-background" style={{ minHeight: 360 }}>
                            <Route path="/admin/registration" component={UsersPage} />
                            <Route path="/admin/positions-page" component={DocumentPositionsPage} />
                            <Route path="/admin/document-statuses-page" component={DocumentStatusesPage} />
                            <Route path="/admin/document-routes-page" component={DocumentRoutesPage} />
                            <Route path="/admin/forms-settings-page" component={FormSettingsPage} />
                    </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
  )
}

export default withRouter(AdminPanel)
