import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, InputBase, Paper } from "@mui/material";
import { useNotify } from "../Notification";

const TextInput = ( { connection } ) =>
{
    const [ message, setMessage ] = React.useState( '' );
    const [ loading, setLoading ] = React.useState( false );
    const notify = useNotify();

    const handleChange = e =>
    {
        setMessage( e.currentTarget.value );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        setLoading( true );

        connection.send( 'SendMessage', message )
            .then( () =>
            {
                setLoading( false );
                setMessage( '' );
            } )
            .catch( e => notify( "Connection error: " + e, 'error' ) );
    };

    return (
        <Paper onSubmit={handleSubmit} component="form" sx={{ p: '2px 4px', mt: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
            <InputBase disabled={loading} onChange={handleChange} value={message} sx={{ ml: 1, flex: 1 }} placeholder="Enter message" />
            <IconButton disabled={loading} type="submit" sx={{ p: '10px' }}>
                <SendIcon />
            </IconButton>
        </Paper>
    );
};

export default TextInput;