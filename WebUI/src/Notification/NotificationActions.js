export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';

export const showNotification = ( message, type, notificationOptions ) => (
	{
		type: SHOW_NOTIFICATION,
		payload:
		{
			...notificationOptions,
			type,
			message,
		},
	}
);

export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';

export const hideNotification = () => (
{
	type: HIDE_NOTIFICATION,
} );
