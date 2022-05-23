import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from './NotificationActions';

const useNotify = () =>
{
	const dispatch = useDispatch();

	return useCallback( ( message, type, messageArgs = {}, autoHideDuration ) =>
		{
			dispatch( showNotification( message, type, { messageArgs, autoHideDuration } ) );
		},
		[ dispatch ]
	);
};

export default useNotify;
