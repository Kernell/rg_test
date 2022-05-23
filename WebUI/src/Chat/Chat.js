import { useEffect, useState } from "react";
import { HubConnectionBuilder } from '@microsoft/signalr';
import MessagesList from "./MessagesList";
import TextInput from "./TextInput";
import Bar from "./Bar";

const Chat = ( { token } ) =>
{
    const [ conn, setConn ] = useState( null );
    const [ connection, setConnection ] = useState( null );
    const [ identity, setIdentity ] = useState( null );

    useEffect( () =>
    {
        const _conn = new HubConnectionBuilder()
            .withUrl( `${window.location.protocol}//${window.location.hostname}/hubs/chat?token=${token}` )
            .withAutomaticReconnect()
            .build();

        setConn( _conn );
    }, [ token ] );

    useEffect( () =>
    {
        if( conn )
        {
            conn.on( 'OnConnected', () =>
            {
                setConnection( conn );
            } );

            conn.start();
        }
    }, [ conn ] ); // eslint-disable-line react-hooks/exhaustive-deps

    return token && (
        <>
            <Bar connection={connection} identity={identity} setIdentity={setIdentity} />
            <MessagesList connection={connection} identity={identity} />
            <TextInput connection={connection} identity={identity} />
        </>
    );
}

export default Chat;
