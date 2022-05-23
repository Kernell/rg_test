import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from './NotificationActions';

const notificationsReducer = ( previousState = [], action ) =>
{
	switch( action.type )
	{
		case SHOW_NOTIFICATION:
			return previousState.concat( action.payload );

		case HIDE_NOTIFICATION:
			return previousState.slice( 1 );

		default:
			return previousState;
	}
};

export default notificationsReducer;

export const getNotification = state => state.notifications[ 0 ];
