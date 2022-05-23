import { useEffect, useState } from "react";
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { InputBase } from "@mui/material";
import { useNotify } from "../Notification";

const GuildName = styled( 'div' )( ( { theme } ) => ( {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha( theme.palette.common.white, 0.15 ),
    '&:hover': {
        backgroundColor: alpha( theme.palette.common.white, 0.25 ),
    },
    marginRight: theme.spacing( 2 ),
    marginLeft: 0,
    width: '100%',
    [ theme.breakpoints.up( 'sm' ) ]: {
        marginLeft: theme.spacing( 3 ),
        width: 'auto',
    },
} ) );

const StyledInputBase = styled( InputBase )( ( { theme } ) => ( {
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing( 1, 1, 1, 0 ),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing( 4 )})`,
        transition: theme.transitions.create( 'width' ),
        width: '100%',
        [ theme.breakpoints.up( 'md' ) ]: {
            width: '20ch',
        },
    },
} ) );

const Bar = ( { connection, identity, setIdentity } ) =>
{
    const [ guild, setGuild ] = useState( '' );
    const notify = useNotify();

    useEffect( () =>
    {
        if( connection )
        {
            connection.on( 'ReceiveIdentity', identity =>
            {
                setIdentity( identity );
            } );

            connection.send( 'GetIdentity' );
        }
    }, [ connection ] ); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = e =>
    {
        setGuild( e.currentTarget.value );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        connection.send( 'SetGuild', guild )
            .then( () =>
            {
                setGuild( '' );
                connection.send( 'GetIdentity' );
            } )
            .catch( e => notify( "Error: " + e, 'error' ) );
    };

    return identity && (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {identity.name} (Guild: {(identity.guild && identity.guild.name) || 'none'})
                    </Typography>
                    <GuildName>
                        <StyledInputBase onChange={handleChange} value={guild} placeholder="New guild name" />
                    </GuildName>
                    <Button color="inherit" onClick={handleSubmit}>Change Guild</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Bar;