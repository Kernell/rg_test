import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from "react-redux";
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

import { Notification, NotificationReducer } from "./Notification";
import Login from "./Login";
import { Chat } from "./Chat";
import Authorization from "./Authorization";

const dataReducer = combineReducers(
	{
		notifications : NotificationReducer,
	}
);

const App = () =>
{
    const store = createStore( dataReducer );

    const [ token, setToken ] = React.useState( Authorization.Get() );

    return (
        <Provider store={store}>
            <Container maxWidth="lg">
				<CssBaseline />
                <Login token={token} setToken={setToken} />
                <Chat  token={token} setToken={setToken} />
			</Container>

            <Notification />
        </Provider>
    );
}

export default App;
