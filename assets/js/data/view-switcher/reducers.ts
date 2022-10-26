/**
 * External dependencies
 */
import type { Reducer } from 'redux';
import { objectHasProp } from '@woocommerce/types';

/**
 * Internal dependencies
 */
import { defaultViewSwitcherState } from './default-state';
import { ACTION_TYPES } from './action-types';

const reducer: Reducer = ( state = defaultViewSwitcherState, action ) => {
	let newState = state;
	switch ( action.type ) {
		case ACTION_TYPES.SET_VIEW:
			newState = {
				...state,
				[ action.context ]: action.view,
			};
			break;
	}
	return newState;
};
export type State = ReturnType< typeof reducer >;

export default reducer;
