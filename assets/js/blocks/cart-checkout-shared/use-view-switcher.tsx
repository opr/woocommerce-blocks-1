/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useCallback } from '@wordpress/element';
import { useDispatch, select, useSelect } from '@wordpress/data';
import { ToolbarGroup, ToolbarDropdownMenu } from '@wordpress/components';
import { eye } from '@woocommerce/icons';
import { Icon } from '@wordpress/icons';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { VIEW_SWITCHER_STORE_KEY } from '@woocommerce/block-data';
import { useWhatChanged } from '@simbathesailor/use-what-changed';

interface View {
	view: string;
	label: string;
	icon: string | JSX.Element;
}

function getView( viewName: string, views: View[] ) {
	return views.find( ( view ) => view.view === viewName );
}

export const useViewSwitcher = (
	clientId: string,
	views: View[],
	context: string
): {
	currentView: string;
	component: JSX.Element;
} => {
	const { setView: setViewInStore } = useDispatch( VIEW_SWITCHER_STORE_KEY );

	// Wrapper for the setViewAction which includes the context so we don't have to pass it every time.
	const setView = useCallback(
		( view ) => {
			setViewInStore( context, view );
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[ context ]
	);

	const { currentView: currentViewName } = useSelect( ( mapSelect ) => {
		const { getCurrentView } = mapSelect( VIEW_SWITCHER_STORE_KEY );
		return {
			currentView: getCurrentView( context ),
		};
	} );

	let currentView = getView( currentViewName, views );
	if ( ! currentView ) {
		currentView = views[ 0 ];
	}

	const { selectBlock } = useDispatch( 'core/block-editor' );
	const { getBlock, getSelectedBlockClientId, getBlockParentsByBlockName } =
		select( blockEditorStore );
	const selectedBlockClientId = getSelectedBlockClientId();

	useEffect( () => {
		const selectedBlock = getBlock( selectedBlockClientId );

		if ( ! selectedBlock ) {
			return;
		}

		if ( currentView.view === selectedBlock.name ) {
			return;
		}

		const viewNames = views.map( ( { view } ) => view );

		if ( viewNames.includes( selectedBlock.name ) ) {
			const newView = getView( selectedBlock.name, views );
			if ( newView ) {
				setView( newView.view );
				return;
			}
		}

		const parentBlockIds = getBlockParentsByBlockName(
			selectedBlockClientId,
			viewNames
		);

		if ( parentBlockIds.length !== 1 ) {
			return;
		}
		const parentBlock = getBlock( parentBlockIds[ 0 ] );

		if ( currentView.view === parentBlock.name ) {
			return;
		}

		const newView = getView( parentBlock.name, views );

		if ( newView ) {
			setView( newView.view );
		}
	}, [
		setView,
		getBlockParentsByBlockName,
		selectedBlockClientId,
		getBlock,
		currentView.view,
		views,
	] );

	const ViewSwitcherComponent = (
		<ToolbarGroup>
			<ToolbarDropdownMenu
				label={ __( 'Switch view', 'woo-gutenberg-products-block' ) }
				text={ currentView.label }
				icon={ <Icon icon={ eye } style={ { marginRight: '8px' } } /> }
				controls={ views.map( ( view ) => ( {
					...view,
					title: <span>{ view.label + view.view }</span>,
					isActive: view.view === currentView.view,
					onClick: () => {
						setView( view.view );
						selectBlock(
							getBlock( clientId ).innerBlocks.find(
								( block: { name: string } ) =>
									block.name === view.view
							)?.clientId || clientId
						);
					},
				} ) ) }
			/>
		</ToolbarGroup>
	);

	return {
		currentView: currentView.view,
		component: ViewSwitcherComponent,
	};
};
