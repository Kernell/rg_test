import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { hideNotification } from "./NotificationActions";
import { getNotification } from "./NotificationReducer";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Notification = props =>
{
	const {
		classes: classesOverride,
		type,
		className,
		autoHideDuration,
		...rest
	} = props;

	const [ open, setOpen ] = useState( false );
	const notification = useSelector( getNotification );
	const dispatch = useDispatch();

	useEffect( () => { setOpen( !!notification ); }, [ notification ] );

	const handleExited = useCallback( ( event, reason ) =>
		{
			setOpen( false );
			dispatch( hideNotification() );
		},
		[ dispatch, notification ] // eslint-disable-line react-hooks/exhaustive-deps
	);

	return notification && (
		<Snackbar
			open={open}
			autoHideDuration={notification.autoHideDuration || autoHideDuration}
			disableWindowBlurListener={notification.undoable}
			onClose={handleExited}
			anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			{...rest}
		>
            <Alert severity={notification.type} sx={{ width: '100%' }}>
				{notification.message}
            </Alert>
		</Snackbar>
	);
};

Notification.defaultProps =
{
	type: 'info',
	autoHideDuration: 4000,
};

export default Notification;
