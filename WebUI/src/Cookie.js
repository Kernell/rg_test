export const Get = ( name ) =>
{
    const matches = document.cookie.match( new RegExp( "(?:^|; )" + name.replace( /([.$?*|{}()[]\/+^])/g, '\\$1' ) + "=([^;]*)" ) );

    return matches ? decodeURIComponent( matches[ 1 ] ) : undefined;
}

export const Set = ( name, value, options = {} ) =>
{
    options =
    {
        path: '/',
        samesite: 'lax',
        domain: "." + window.location.hostname.split( "." ).slice( -2 ).join( "." ),
        ...options
    };

    if( options.expires instanceof Date )
    {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent( name ) + "=" + encodeURIComponent( value );

    for( let optionKey in options )
    {
        updatedCookie += "; " + optionKey;

        const optionValue = options[ optionKey ];
        
        if( optionValue !== true )
        {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export const Remove = ( name ) =>
{
    Set( name, "",
        {
            'max-age': -1
        }
    );
}
