import React from 'react';
import { Input } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import { GoogleConnectButton } from './GSheetButtons';

const GSheetIdForm = ({
    useSheetId,
    handleAuth,
    checkAuth,
}) => {
    const [sheetId, setSheetId] = useSheetId;
    return (
        <div>
            <Input
                size="large"
                placeholder="Google Sheet ID found in URL"
                prefix={<TableOutlined />}
                value={sheetId}
                onChange={e => { setSheetId(e.target.value); }}
                suffix={
                    <GoogleConnectButton
                        checkAuth={checkAuth}
                        handleAuth={handleAuth}
                    />
                }
            />
        </div>
    );
};

export default GSheetIdForm;
