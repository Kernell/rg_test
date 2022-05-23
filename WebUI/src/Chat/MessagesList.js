import React from 'react';
import { Paper } from "@mui/material";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const Message = ( { message } ) =>
{
    if( !message )
    {
        return (
            <ListItem>
                <ListItemText secondary="No messages" />
            </ListItem>
        );
    }

    const { id, author, text, createdAt } = message;

    return (
        <ListItem>
            <ListItemText id={id} primary={`${(author && author.name) || 'Unknown'} (${createdAt})`} secondary={text} />
        </ListItem>
    );
};

const MessagesList = ( { connection, identity } ) =>
{
    const messagesEndRef = React.useRef( null );
    const [ messages, setMessages ] = React.useState( [] );

    const scrollToBottom = () =>
    {
        messagesEndRef.current?.scrollIntoView( { behavior: "smooth" } );
    }

    React.useEffect( () =>
    {
        if( connection )
        {
            connection.on( 'ReceiveMessage', message =>
            {
                setMessages( i => [ ...i, message ] );
            } );
        }
    }, [ connection ] ); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect( () =>
    {
        if( connection )
        {
            setMessages( [] );
            connection.send( 'GetHistory', 50 );
        }
    }, [ identity ] ); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect( () =>
    {
        scrollToBottom();
    }, [ messages ] );

    return (
        <>
            <Paper>
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 400,
                        '& ul': { padding: 0 },
                    }}
                >
                    {messages.length === 0 ? <Message /> : messages.map( ( message ) => (
                        <Message key={`message-${message.id}`} message={message} />
                    ) )}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>
        </>
    );
}

export default MessagesList;
