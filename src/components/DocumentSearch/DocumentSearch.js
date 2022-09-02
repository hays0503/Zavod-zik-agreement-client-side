import React, { useEffect, useState, useRef } from 'react'

import { Layout } from 'antd'
import { useHistory, useLocation, Redirect, Route, withRouter } from 'react-router-dom'
import Header1 from './common/Header1'
import { useUser, accessRedirect, handlerQuery } from '../../core/functions'

import Search from './pages/Search/Search'

const { Header } = Layout

const { Content } = Layout

const DocumentSearch = React.memo((props) => {
  const user = useUser()
  const { pathname } = useLocation()

  const [headerTitle, setHeaderTitle] = useState('Поиск')

  if (pathname === '/document-search/' || pathname === '/document-search') {
    if (user.documentSearch.search.select) {
      return <Redirect to='/document-search/search' />
    }
  };

  return (
        <Layout className="site-layout-background" style={{
          padding: 24,
          margin: 0,
          minHeight: 280
        }}>
            <Header1 title={headerTitle} user={user} />
            <Layout>
                <Layout className="content-layout">
                    <Content className="site-layout-background"
                        style={{
                          padding: 24,
                          margin: 0,
                          minHeight: 280
                        }}>
                            <Route path={'/document-search/search'} component={accessRedirect(Search)} />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
  )
})

export default withRouter(DocumentSearch)
