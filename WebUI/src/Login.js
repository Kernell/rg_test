import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { TextField } from "@mui/material";
import { useNotify } from "./Notification";
import LoadingButton from '@mui/lab/LoadingButton';
import Authorization from "./Authorization";

const style =
{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 0,
    p: 0,
};

function TabPanel( props )
{
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const LoginForm = ( { setToken } ) =>
{
    const [ state, setState ] = React.useState( { login: '', password: '' } );
    const [ loading, setLoading ] = React.useState( false );
    const notify = useNotify();

    const handleChange = e =>
    {
        setState( { ...state, [ e.currentTarget.id ]: e.currentTarget.value } );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        setLoading( true );

        Authorization.Login( state.login, state.password )
            .then( data =>
            {
                setToken( data );
            } )
            .catch( error =>
            { 
                notify( error, 'error' ); 
                setLoading( false );
            } );
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ py: 1 }}><TextField disabled={loading} value={state.login} onChange={handleChange} id="login" label="Login" variant="standard" fullWidth required /></Box>
            <Box sx={{ py: 1 }}><TextField disabled={loading} value={state.password} onChange={handleChange} id="password" label="Password" variant="standard" type="password" fullWidth required /></Box>
            <Box sx={{ py: 1 }}><LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Login</LoadingButton></Box>
        </form>
    );
};

const RegisterForm = ( { setToken } ) =>
{
    const [ state, setState ] = React.useState( { name: '', login: '', password: '' } );
    const [ loading, setLoading ] = React.useState( false );
    const notify = useNotify();

    const handleChange = e =>
    {
        setState( { ...state, [ e.currentTarget.id ]: e.currentTarget.value } );
    };

    const handleSubmit = ( e ) =>
    {
        e.preventDefault();

        setLoading( true );

        Authorization.Register( state.name, state.login, state.password )
            .then( data =>
            {
                setToken( data );
            } )
            .catch( error =>
            { 
                notify( error, 'error' ); 
                setLoading( false );
            } );
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ py: 1 }}><TextField disabled={loading} value={state.name} onChange={handleChange} id="name" label="Name" variant="standard" fullWidth required /></Box>
            <Box sx={{ py: 1 }}><TextField disabled={loading} value={state.login} onChange={handleChange} id="login" label="Login" variant="standard" fullWidth required /></Box>
            <Box sx={{ py: 1 }}><TextField disabled={loading} value={state.password} onChange={handleChange} id="password" label="Password" variant="standard" type="password" fullWidth required /></Box>
            <Box sx={{ py: 1 }}><LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Register</LoadingButton></Box>
        </form>
    );
};

const Login = ( { setToken, token } ) =>
{
    const [ open, setOpen ] = React.useState( false );
    const [ value, setValue ] = React.useState( 0 );

    const handleChange = ( event, newValue ) =>
    {
        setValue( newValue );
    };

    useEffect( () =>
        {
            setOpen( token === undefined );
        },
        [ token ]
    ); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal open={open}>
            <Box sx={style}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} variant="fullWidth">
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <LoginForm setToken={setToken} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <RegisterForm setToken={setToken} />
                </TabPanel>
            </Box>
        </Modal>
    );
};

export default Login;
