// @ts-nocheck
// Debugger.
import { use, select } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import debugFactory from 'debug';
import { find, isEqual, cloneDeep } from 'lodash';

const debug = console.log;

const noop = () => {};
let ignoreNextReplaceBlocksAction = false;

const tracksRecordEvent = ( ...args ) => console.log( args );
/**
 * Global handler.
 * Use this function when you need to inspect the block
 * to get specific data and populate the record.
 *
 * @param {object} block - Block object data.
 * @returns {object} Record properties object.
 */
function globalEventPropsHandler( block ) {
	if ( ! block?.name ) {
		return {};
	}

	// `getActiveBlockVariation` selector is only available since Gutenberg 10.6.
	// To avoid errors, we make sure the selector exists. If it doesn't,
	// then we fallback to the old way.
	const { getActiveBlockVariation } = select( 'core/blocks' );
	if ( getActiveBlockVariation ) {
		return {
			variation_slug: getActiveBlockVariation(
				block.name,
				block.attributes
			)?.name,
		};
	}

	// Pick up variation slug from `core/embed` block.
	if ( block.name === 'core/embed' && block?.attributes?.providerNameSlug ) {
		return { variation_slug: block.attributes.providerNameSlug };
	}

	// Pick up variation slug from `core/social-link` block.
	if ( block.name === 'core/social-link' && block?.attributes?.service ) {
		return { variation_slug: block.attributes.service };
	}

	return {};
}
/**
 * Looks up the block name based on its id.
 *
 * @param {string} blockId Block identifier.
 * @returns {string|null} Block name if it exists. Otherwise, `null`.
 */
const getTypeForBlockId = ( blockId ) => {
	const block = select( 'core/block-editor' ).getBlock( blockId );
	return block ? block.name : null;
};

/**
 * Guess which inserter was used to insert/replace blocks.
 *
 * @param {string[]|string} originalBlockIds ids or blocks that are being replaced
 * @returns {'header-inserter'|'slash-inserter'|'quick-inserter'|'block-switcher'|'payments-intro-block'|undefined} ID representing the insertion method that was used
 */
const getBlockInserterUsed = ( originalBlockIds = [] ) => {
	const clientIds = Array.isArray( originalBlockIds )
		? originalBlockIds
		: [ originalBlockIds ];
	// Check if the main inserter (opened using the [+] button in the header) is open.
	// If it is then the block was inserted using this menu. This inserter closes
	// automatically when the user tries to use another form of block insertion
	// (at least at the time of writing), which is why we can rely on this method.
	if (
		select( 'core/edit-post' )?.isInserterOpened() ||
		select( 'core/edit-site' )?.isInserterOpened() ||
		select( 'core/edit-widgets' )?.isInserterOpened() ||
		document
			.querySelector( '.customize-widgets-layout__inserter-panel' )
			?.contains( document.activeElement )
	) {
		return 'header-inserter';
	}

	// The block switcher open state is not stored in Redux, it's component state
	// inside a <Dropdown>, so we can't access it. Work around this by checking if
	// the DOM elements are present on the page while the block is being replaced.
	if (
		clientIds.length &&
		document.querySelector( '.block-editor-block-switcher__container' )
	) {
		return 'block-switcher';
	}

	// Inserting a block using a slash command is always a block replacement of
	// a paragraph block. Checks the block contents to see if it starts with '/'.
	// This check must go _after_ the block switcher check because it's possible
	// for the user to type something like "/abc" that matches no block type and
	// then use the block switcher, and the following tests would incorrectly capture
	// that case too.
	if (
		clientIds.length === 1 &&
		select( 'core/block-editor' ).getBlockName( clientIds[ 0 ] ) ===
			'core/paragraph' &&
		select( 'core/block-editor' )
			.getBlockAttributes( clientIds[ 0 ] )
			.content.startsWith( '/' )
	) {
		return 'slash-inserter';
	}

	// The quick inserter open state is not stored in Redux, it's component state
	// inside a <Dropdown>, so we can't access it. Work around this by checking if
	// the DOM elements are present on the page while the block is being inserted.
	if (
		// The new quick-inserter UI, marked as __experimental
		document.querySelector( '.block-editor-inserter__quick-inserter' ) ||
		// Legacy block inserter UI
		document.querySelector( '.block-editor-inserter__block-list' )
	) {
		return 'quick-inserter';
	}

	// This checks validates if we are inserting a block from the Payments Inserter block.
	if (
		clientIds.length === 1 &&
		select( 'core/block-editor' ).getBlockName( clientIds[ 0 ] ) ===
			'jetpack/payments-intro'
	) {
		return 'payments-intro-block';
	}

	return undefined;
};

/**
 * Ensure you are working with block object. This either returns the object
 * or tries to lookup the block by id.
 *
 * @param {string|object} block Block object or string identifier.
 * @returns {object} block object or an empty object if not found.
 */
const ensureBlockObject = ( block ) => {
	if ( typeof block === 'object' ) {
		return block;
	}
	return select( 'core/block-editor' ).getBlock( block ) || {};
};

/**
 * This helper function tracks the given blocks recursively
 * in order to track inner blocks.
 *
 * The event properties will be populated (optional)
 * propertiesHandler function. It acts as a callback
 * passing two arguments: the current block and
 * the parent block (if exists). Take this as
 * an advantage to add other custom properties to the event.
 *
 * Also, it adds default `inner_block`,
 * and `parent_block_client_id` (if parent exists) properties.
 *
 * @param {Array}    blocks            Block instances object or an array of such objects
 * @param {string}   eventName         Event name used to track.
 * @param {Function} propertiesHandler Callback function to populate event properties
 * @param {object}   parentBlock       parent block. optional.
 * @returns {void}
 */
function trackBlocksHandler(
	blocks,
	eventName,
	propertiesHandler = noop,
	parentBlock
) {
	const castBlocks = Array.isArray( blocks ) ? blocks : [ blocks ];
	if ( ! castBlocks || ! castBlocks.length ) {
		return;
	}

	castBlocks.forEach( ( block ) => {
		// Make this compatible with actions that pass only block id, not objects.
		block = ensureBlockObject( block );

		const eventProperties = {
			...globalEventPropsHandler( block ),
			...propertiesHandler( block, parentBlock ),
			inner_block: !! parentBlock,
		};

		if ( parentBlock ) {
			eventProperties.parent_block_name = parentBlock.name;
		}

		tracksRecordEvent( eventName, eventProperties );

		if ( block.innerBlocks && block.innerBlocks.length ) {
			trackBlocksHandler(
				block.innerBlocks,
				eventName,
				propertiesHandler,
				block
			);
		}
	} );
}

/**
 * A lot of actions accept either string (block id)
 * or an array of multiple string when operating with multiple blocks selected.
 * This is a convenience method that processes the first argument of the action (blocks)
 * and calls your tracking for each of the blocks involved in the action.
 *
 * This method tracks only blocks explicitly listed as a target of the action.
 * If you also want to track an event for all child blocks, use `trackBlocksHandler`.
 *
 * @see {@link trackBlocksHandler} for a recursive version.
 * @param {string} eventName event name
 * @returns {Function} track handler
 */
const getBlocksTracker =
	( eventName ) => ( blockIds, fromRootClientId, toRootClientId ) => {
		console.log( eventName, blockIds, fromRootClientId, toRootClientId );
	};

/**
 * Track block insertion.
 *
 * @param {object|Array} blocks block instance object or an array of such objects
 * @param {Array} args additional insertBlocks data e.g. metadata containing pattern name.
 * @returns {void}
 */
const trackBlockInsertion = ( blocks, ...args ) => {
	console.log( blocks, ...args );
};

/**
 * Track block removal.
 *
 * @param {object|Array} blocks block instance object or an array of such objects
 * @returns {void}
 */
const trackBlockRemoval = ( blocks ) => {
	console.log( blocks );
};

/**
 * Track block replacement.
 *
 * @param {Array} originalBlockIds ids or blocks that are being replaced
 * @param {object|Array} blocks block instance object or an array of such objects
 * @param {Array} args Additional data supplied to replaceBlocks action
 * @returns {void}
 */
const trackBlockReplacement = ( originalBlockIds, blocks, ...args ) => {
	console.log( originalBlockIds, blocks, ...args );
};

/**
 * Track inner blocks replacement.
 * Page Templates insert their content into the page replacing everything that was already there.
 *
 * @param {Array} rootClientId id of parent block
 * @param {object|Array} blocks block instance object or an array of such objects
 * @returns {void}
 */
const trackInnerBlocksReplacement = ( rootClientId, blocks ) => {
	console.log( rootClientId, blocks );
};

/**
 * Track update and publish action for Global Styles plugin.
 *
 * @param {string} eventName Name of the track event.
 * @returns {Function} tracker
 */
const trackGlobalStyles = ( eventName ) => ( options ) => {
	tracksRecordEvent( eventName, {
		...options,
	} );
};

/**
 * Logs any error notice which is shown to the user so we can determine how often
 * folks see different errors and what types of sites they occur on.
 *
 * @param {string} content The error message. Like "Update failed."
 * @param {object} options Optional. Extra data logged with the error in Gutenberg.
 */
const trackErrorNotices = ( content, options ) =>
	tracksRecordEvent( 'wpcom_gutenberg_error_notice', {
		notice_text: content,
		notice_options: JSON.stringify( options ), // Returns undefined if options is undefined.
	} );

const trackEnableComplementaryArea = ( scope, id ) => {
	const activeArea =
		select( 'core/interface' ).getActiveComplementaryArea( scope );
	// We are tracking both global styles open here and when global styles
	// is closed by opening another sidebar in its place.
	if (
		activeArea !== 'edit-site/global-styles' &&
		id === 'edit-site/global-styles'
	) {
		tracksRecordEvent( 'wpcom_block_editor_global_styles_panel_toggle', {
			open: true,
		} );
	} else if (
		activeArea === 'edit-site/global-styles' &&
		id !== 'edit-site/global-styles'
	) {
		tracksRecordEvent( 'wpcom_block_editor_global_styles_panel_toggle', {
			open: false,
		} );
	}
};

const trackDisableComplementaryArea = ( scope ) => {
	const activeArea =
		select( 'core/interface' ).getActiveComplementaryArea( scope );
	if (
		activeArea === 'edit-site/global-styles' &&
		scope === 'core/edit-site'
	) {
		tracksRecordEvent( 'wpcom_block_editor_global_styles_panel_toggle', {
			open: false,
		} );
	}
};

const trackSaveEntityRecord = ( kind, name, record ) => {
	if ( kind === 'postType' && name === 'wp_template_part' ) {
		const variationSlug =
			record.area !== 'uncategorized' ? record.area : undefined;
		if (
			document.querySelector( '.edit-site-create-template-part-modal' )
		) {
			ignoreNextReplaceBlocksAction = true;
			const convertedParentBlocks = select(
				'core/block-editor'
			).getBlocksByClientId(
				select( 'core/block-editor' ).getSelectedBlockClientIds()
			);
			// We fire the event with and without the block names. We do this to
			// make sure the event is tracked all the time. The block names
			// might become a string that's too long and as a result it will
			// fail because of URL length browser limitations.
			tracksRecordEvent( 'wpcom_block_editor_convert_to_template_part', {
				variation_slug: variationSlug,
			} );
			tracksRecordEvent( 'wpcom_block_editor_convert_to_template_part', {
				variation_slug: variationSlug,
				block_names: convertedParentBlocks.join( ',' ),
			} );
		} else {
			tracksRecordEvent( 'wpcom_block_editor_create_template_part', {
				variation_slug: variationSlug,
				content: record.content ? record.content : undefined,
			} );
		}
	}
};

/**
 * Track list view open and close events.
 *
 * @param {boolean} isOpen new state of the list view
 */
const trackListViewToggle = ( isOpen ) => {
	tracksRecordEvent( 'wpcom_block_editor_list_view_toggle', {
		is_open: isOpen,
	} );
};

const trackSiteEditorBrowsingSidebarOpen = () => {
	// We want to make sure the browsing sidebar is closed.
	// This action is triggered even if the sidebar is open
	// which we want to avoid tracking.
	const isOpen = select( 'core/edit-site' ).isNavigationOpened();
	if ( isOpen ) {
		return;
	}

	tracksRecordEvent( 'wpcom_block_editor_nav_sidebar_open' );
};

const trackSiteEditorCreateTemplate = ( { slug } ) => {
	tracksRecordEvent( 'wpcom_block_editor_nav_sidebar_item_add', {
		item_type: 'template',
		item_slug: slug,
	} );
};

/**
 * Flag used to track the first call of tracking
 * `wpcom_block_editor_nav_sidebar_item_edit`. When the site editor is loaded
 * with query params specified to load a specific template/template part, then
 * `setTemplate`, `setTemplatePart` or `setPage` is called editor load. We don't
 * want to track the first call so we use this flag to track it.
 */
let isSiteEditorFirstSidebarItemEditCalled = false;
const trackSiteEditorChangeTemplate = ( id, slug ) => {
	if ( ! isSiteEditorFirstSidebarItemEditCalled ) {
		isSiteEditorFirstSidebarItemEditCalled = true;
		return;
	}

	tracksRecordEvent( 'wpcom_block_editor_nav_sidebar_item_edit', {
		item_type: 'template',
		item_id: id,
		item_slug: slug,
	} );
};

const trackSiteEditorChangeTemplatePart = ( id ) => {
	if ( ! isSiteEditorFirstSidebarItemEditCalled ) {
		isSiteEditorFirstSidebarItemEditCalled = true;
		return;
	}

	tracksRecordEvent( 'wpcom_block_editor_nav_sidebar_item_edit', {
		item_type: 'template_part',
		item_id: id,
	} );
};

/**
 * Variable used to track the time of the last `trackSiteEditorChange` function
 * call. This is used to debounce the function because it's called twice due to
 * a bug. We prefer the first call because that's when the
 * `getNavigationPanelActiveMenu` function returns the actual active menu.
 *
 * Keep this for backward compatibility.
 * Fixed in: https://github.com/WordPress/gutenberg/pull/33286
 */
let lastTrackSiteEditorChangeContentCall = 0;
const trackSiteEditorChangeContent = ( { type, slug } ) => {
	if ( Date.now() - lastTrackSiteEditorChangeContentCall < 50 ) {
		return;
	}

	if ( ! isSiteEditorFirstSidebarItemEditCalled ) {
		isSiteEditorFirstSidebarItemEditCalled = true;
		return;
	}

	const activeMenu =
		select( 'core/edit-site' ).getNavigationPanelActiveMenu();
	if ( ! type && activeMenu === 'content-categories' ) {
		type = 'taxonomy_category';
	}

	tracksRecordEvent( 'wpcom_block_editor_nav_sidebar_item_edit', {
		item_type: type,
		item_slug: slug,
	} );

	lastTrackSiteEditorChangeContentCall = Date.now();
};

/**
 * Tracks editEntityRecord for global styles updates.
 *
 * @param {string} kind    Kind of the edited entity record.
 * @param {string} type    Name of the edited entity record.
 * @param {number} id      Record ID of the edited entity record.
 * @param {object} updates The edits made to the record.
 */
const trackEditEntityRecord = ( kind, type, id, updates ) => {
	// When the site editor is loaded without query params specified to which
	// template or template part to load, then the `setPage`, `setTemplate` and
	// `setTemplatePart` call is skipped. In this case we want to make sure the
	// first call is tracked.
	if (
		! isSiteEditorFirstSidebarItemEditCalled &&
		kind === 'postType' &&
		( type === 'wp_template' || type === 'wp_template_part' )
	) {
		isSiteEditorFirstSidebarItemEditCalled = true;
		return;
	}

	if ( kind === 'root' && type === 'globalStyles' ) {
		const editedEntity = select( 'core' ).getEditedEntityRecord(
			kind,
			type,
			id
		);
		const entityContent = {
			settings: cloneDeep( editedEntity.settings ),
			styles: cloneDeep( editedEntity.styles ),
		};
		const updatedContent = {
			settings: cloneDeep( updates.settings ),
			styles: cloneDeep( updates.styles ),
		};
	}
};

/**
 * Tracks saveEditedEntityRecord for saving various entities.
 *
 * @param {string} kind Kind of the edited entity record.
 * @param {string} type Name of the edited entity record.
 * @param {number} id   Record ID of the edited entity record.
 */
const trackSaveEditedEntityRecord = ( kind, type, id ) => {
	const savedEntity = select( 'core' ).getEntityRecord( kind, type, id );
	const editedEntity = select( 'core' ).getEditedEntityRecord(
		kind,
		type,
		id
	);

	// If the item saved is a template part, make note of the area variation.
	const templatePartArea =
		type === 'wp_template_part' ? savedEntity?.area : undefined;
	// If the template parts area variation changed, add the new area classification as well.
	const newTemplatePartArea =
		type === 'wp_template_part' && savedEntity?.area !== editedEntity?.area
			? editedEntity.area
			: undefined;

	tracksRecordEvent( 'wpcom_block_editor_edited_entity_saved', {
		entity_kind: kind,
		entity_type: type,
		entity_id: id,
		saving_source: () => undefined,
		template_part_area: templatePartArea,
		new_template_part_area: newTemplatePartArea,
	} );

	if ( kind === 'root' && type === 'globalStyles' ) {
		const entityContent = {
			settings: cloneDeep( savedEntity.settings ),
			styles: cloneDeep( savedEntity.styles ),
		};
		const updatedContent = {
			settings: cloneDeep( editedEntity.settings ),
			styles: cloneDeep( editedEntity.styles ),
		};
	}
};

/**
 * Tracks __experimentalSaveEditedEntityRecord for saving various entities. Currently this is only
 * expected to be triggered for site entity items like logo, description, and title.
 *
 * @param {string} kind Kind of the edited entity record.
 * @param {string} type Name of the edited entity record.
 * @param {number} id   Record ID of the edited entity record.
 */
const trackSaveSpecifiedEntityEdits = ( kind, type, id, itemsToSave ) => {
	console.log( kind, type, id, itemsToSave );
};

/**
 * Tracker can be
 * - string - which means it is an event name and should be tracked as such automatically
 * - function - in case you need to load additional properties from the action.
 *
 * @type {object}
 */
const REDUX_TRACKING = {
	'core/block-editor': {
		insertBlock: trackBlockInsertion,
		insertBlocks: trackBlockInsertion,
		replaceBlock: trackBlockReplacement,
		replaceBlocks: trackBlockReplacement,
		replaceInnerBlocks: trackInnerBlocksReplacement,
	},
};

/**
 * Mapping of Events by DOM selector.
 * Events are matched by selector and their handlers called.
 *
 * @type {Array}
 */
const EVENT_TYPES = [ 'keyup', 'click' ];

use( ( registry ) => ( {
	dispatch: ( namespace ) => {
		const namespaceName =
			typeof namespace === 'object' ? namespace.name : namespace;
		const actions = { ...registry.dispatch( namespaceName ) };
		const trackers = REDUX_TRACKING[ namespaceName ];
		if ( trackers ) {
			Object.keys( trackers ).forEach( ( actionName ) => {
				const originalAction = actions[ actionName ];
				const tracker = trackers[ actionName ];
				actions[ actionName ] = ( ...args ) => {
					debug( 'action "%s" called with %o arguments', actionName, [
						...args,
					] );
					// We use a try-catch here to make sure the `originalAction`
					// is always called. We don't want to break the original
					// behaviour when our tracking throws an error.
					try {
						if ( typeof tracker === 'string' ) {
							// Simple track - just based on the event name.
							tracksRecordEvent( tracker );
						} else if ( typeof tracker === 'function' ) {
							// Advanced tracking - call function.
							tracker( ...args );
						}
					} catch ( err ) {
						// eslint-disable-next-line no-console
						console.error( err );
					}
					return originalAction( ...args );
				};
			} );
		}
		return actions;
	},
} ) );
