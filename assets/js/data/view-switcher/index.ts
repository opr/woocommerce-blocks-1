/**
 * External dependencies
 */
import { createReduxStore, register } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from './reducers';
import * as selectors from './selectors';
import * as actions from './actions';
import { STORE_KEY } from './constants';

export const config = {
	reducer,
	selectors,
	actions,
};

const store = createReduxStore( STORE_KEY, config );
register( store );

export const VIEW_SWITCHER_STORE_KEY = STORE_KEY;
