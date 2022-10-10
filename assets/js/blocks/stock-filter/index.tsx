/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { Icon, box } from '@wordpress/icons';
import classNames from 'classnames';
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { blockAttributes } from './attributes';
import type { Attributes } from './types';

registerBlockType( metadata, {
	title: __( 'Filter Products by Stock', 'woo-gutenberg-products-block' ),
	description: __(
		'Enable customers to filter the product grid by stock status.',
		'woo-gutenberg-products-block'
	),
	icon: {
		src: (
			<Icon
				icon={ box }
				className="wc-block-editor-components-block-icon"
			/>
		),
	},
	attributes: {
		...metadata.attributes,
		...blockAttributes,
	},
	edit,
	// Save the props to post content.
	save( { attributes }: { attributes: Attributes } ) {
		const {
			className,
			showCounts,
			heading,
			headingLevel,
			showFilterButton,
		} = attributes;
		const data: Record< string, unknown > = {
			'data-show-counts': showCounts,
			'data-heading': heading,
			'data-heading-level': headingLevel,
		};
		if ( showFilterButton ) {
			data[ 'data-show-filter-button' ] = showFilterButton;
		}
		return (
			<div
				{ ...useBlockProps.save( {
					className: classNames( 'is-loading', className ),
				} ) }
				{ ...data }
			>
				<span
					aria-hidden
					className="wc-block-product-stock-filter__placeholder"
				/>
			</div>
		);
	},
} );
