import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { useUser, accessRedirect } from '../../core/functions';
import Header1 from '../../core/Header1';
import SiderMenu from './SiderMenu';
import { Redirect, Route, useLocation, withRouter } from 'react-router-dom';
import Orders from './/pages/Orders/Orders';

//user
import RevisedPageUser from './pages/RevisedPageUser/RevisedPageUser';
import ApprovedPageUser from './pages/ApprovedPageUser/ApprovedPageUser';
import RejectedDocumentsUser from './pages/RejectedDocumentsUser/RejectedDocumentsUser'

//Approver
import OnApprovalDocuments from './pages/OnApprovalDocuments/OnApprovalDocuments';
import OnApprovalDocumentsList from './pages/OnApprovalDocumentsList/OnApprovalDocumentsList';

//Executioner
import ForExecutionInbox from './pages/ForExecutionInbox/ForExecutionInbox.js';

//Admin
import AdminAllPage from './pages/XAdminPageAll/AdminPageAll';
import RejectedDocuments from './pages/RejectedDocuments'


const { Content } = Layout

let DocumentControl = (props) => {
    let { pathname } = useLocation();
    const user = useUser();

    const [headerTitle, setHeaderTitle] = useState('Test');

    const [countManager, setCountManager] = useState({
        revised: "0",
        approved: "0",
        rejected: "0",
        onaproval: "0",
        type: "count"
    });
    const [countFunction, setCountFunction] = useState(null);

    useEffect(() => {
        if (countFunction?.setValue && typeof (countFunction.setValue) == 'function') {
            countFunction.setValue(prev => {
                let old = Object.assign({}, prev);
                old.revised= prev.revised - countManager.revised;
                old.approved = prev.approved - countManager.approved;
                old.rejected = prev.rejected - countManager.rejected;
                old.onaproval = prev.onaproval - countManager.onaproval;
                return old;
            })
        };
    }, [countManager]);

    if (pathname === '/document-control/' || pathname === '/document-control') {
        if (user.documentControl.orders.select) {
            return <Redirect to='/document-control/orders' />;
        }
    };

    const countF = (stateSetter) => {
        const setValue = (value) => {
            stateSetter(value)
        }
        setCountFunction({ setValue: setValue, stateSetter: stateSetter });
    }

    return (
        <Layout>
            <Header1 title={headerTitle} user={user} />
            <Layout>
                <SiderMenu setHeaderTitle={setHeaderTitle} setCountManager={setCountManager} countF={countF} />
                <Layout className="content-layout">
                    <Content className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280
                        }}>

                        <Route path={'/document-control/orders'} component={accessRedirect(Orders)} />
                            <Route path={'/document-control/reviseduser'} component={accessRedirect(RevisedPageUser)} />
                            <Route path={'/document-control/approveduser'} component={accessRedirect(ApprovedPageUser)} />
                            <Route path={'/document-control/rejecteduser'} component={accessRedirect(RejectedDocumentsUser)} />

                        
                        <Route exact path="/document-control/on-approval" render={(props) => <OnApprovalDocuments {...props} title={`Props through render`} />} setCountManager={setCountManager}/>
                        <Route path={'/document-control/on-approval-list'} component={accessRedirect(OnApprovalDocumentsList)} />

                        <Route path={'/document-control/approved'} component={accessRedirect(AdminAllPage)} />
                        <Route path={'/document-control/rejected'} component={accessRedirect(RejectedDocuments)} />

                        <Route path={'/document-control/for-execution-inbox'} component={accessRedirect(ForExecutionInbox)} />
                    </Content>
                </Layout>
            </Layout>
            </Layout>
    )
}

export default withRouter(DocumentControl);