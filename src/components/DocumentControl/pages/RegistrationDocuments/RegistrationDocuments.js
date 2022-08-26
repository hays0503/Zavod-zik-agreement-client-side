import { useMutation } from '@apollo/client';
import { Button, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { handlerQuery, handlerMutation, useUser } from '../../../../core/functions';
import ModalUpdate from '../../modals/ModalUpdate';
import TableContainer from '../../tableContainers/TableContainer';
import TitleMenu from '../../../../core/TitleMenu';
import test from "../../../../core/functions/test";

import AllDocumentsGQL from '../../gql/AllDocumentsGQL'

let RegistrationDocuments = React.memo((props) => {

    const visibleModalUpdate = useState(false);
    const visibleModalUpdate2 = useState(false);
    const visibleModalUpdate3 = useState(false);
    const visibleModalUpdate4 = useState(false);
    const visibleModalUpdate5 = useState(false);

    let titleMenu = (tableProps) => {
        return (
            <TitleMenu
                buttons={[
                    <ModalUpdate
                        visibleModalUpdate={visibleModalUpdate} GQL={AllDocumentsGQL}
                        visibleModalUpdate2={visibleModalUpdate2} GQL2={AllDocumentsGQL}
                        visibleModalUpdate3={visibleModalUpdate3} GQL3={AllDocumentsGQL}
                        visibleModalUpdate4={visibleModalUpdate4} GQL4={AllDocumentsGQL}
                        visibleModalUpdate5={visibleModalUpdate5} GQL5={AllDocumentsGQL}
                        title='Просмотр договора' selectedRowKeys={tableProps.selectedRowKeys} update={true} width={750} />
                ]}
                selectedRowKeys={tableProps.selectedRowKeys}
            />)
    };

    return (
        <>
            <TableContainer
                // data={{ dict, records: list }}
                // loading={loading}
                title={titleMenu}
                visibleModalUpdate={visibleModalUpdate}
                visibleModalUpdate2={visibleModalUpdate2}
                visibleModalUpdate3={visibleModalUpdate3}
                visibleModalUpdate4={visibleModalUpdate4}
                visibleModalUpdate5={visibleModalUpdate5}
            />
        </>
    )
})

export default RegistrationDocuments