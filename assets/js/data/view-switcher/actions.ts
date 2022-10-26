/**
 * Internal dependencies
 */
import { ACTION_TYPES } from './action-types';

export const setView = ( context, view ) => {
	return {
		type: ACTION_TYPES.SET_VIEW,
		view,
		context,
	};
};
