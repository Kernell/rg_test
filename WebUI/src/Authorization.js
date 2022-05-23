import { HubConnectionBuilder } from '@microsoft/signalr';

import * as Cookie from "./Cookie";

export const AUTH_COOKIE_NAME = "Authorization";

const Send = ( method, payload ) =>
{
    const connection = new HubConnectionBuilder()
        .withUrl( `${window.location.protocol}//${window.location.hostname}/hubs/id` )
        .withAutomaticReconnect()
        .build();

    return new Promise( ( resolve, reject ) =>
        {
            connection.start()
                .then( result =>
                {
                    connection.on( method + 'Result', ( { token, error }  ) =>
                    {
                        connection.stop();

                        if( error )
                        {
                            return reject( error )
                        }

                        Cookie.Set( AUTH_COOKIE_NAME, token );

	                    return resolve( token );
                    } );

                    connection.send( method, ...payload );
                } )
                .catch( e => reject( 'Connection failed: ' + e ) );
        } );
};

const Authorization =
{
    Login: ( login, password ) =>
    {
        return Send( "Authorize", [ login, password ] );
    },

    Logout: () =>
    {
        Cookie.Remove( AUTH_COOKIE_NAME );

	    return Promise.resolve();
    },

    Register: ( name, login, password ) =>
    {
        return Send( "Register", [ name, login, password ] );
    },

    Get: () =>
    {
        return Cookie.Get( AUTH_COOKIE_NAME );
    },
};

export default Authorization;