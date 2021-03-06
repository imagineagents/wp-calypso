/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import ActivityLogBanner from './index';
import ProgressBar from 'components/progress-bar';
import QueryRewindRestoreStatus from 'components/data/query-rewind-restore-status';
import QueryRewindBackupStatus from 'components/data/query-rewind-backup-status';

/**
 * Normalize timestamp values
 *
 * Some timestamps are in seconds instead
 * of in milliseconds and this will make
 * sure they are all reported in ms
 *
 * The chosen comparison date is older than
 * WordPress so no backups should already
 * exist prior to that date 😉
 *
 * @param {Number} ts timestamp in 's' or 'ms'
 * @returns {Number} timestamp in 'ms'
 */
const ms = ts =>
	ts < 946702800000 // Jan 1, 2001 @ 00:00:00
		? ts * 1000 // convert s -> ms
		: ts;

function ProgressBanner( {
	applySiteOffset,
	moment,
	percent,
	status,
	siteId,
	timestamp,
	translate,
	restoreId,
	downloadId,
	action,
	context,
} ) {
	let title = '';
	let description = '';
	let statusMessage = '';

	const dateTime = applySiteOffset( moment.utc( ms( timestamp ) ) ).format( 'LLLL' );
	const statusText = translate( 'Away we go!' );
	const notifiedText = translate( "You'll be notified once it's complete." );

	switch ( action ) {
		case 'restore':
			if ( 'alternate' === context ) {
				title = translate( 'Currently cloning your site' );
				description = translate( "We're cloning your site to %(dateTime)s.", {
					args: { dateTime },
				} );
				statusMessage =
					'queued' === status
						? translate( 'The cloning process will start in a moment.' )
						: statusText + ' ' + translate( 'Your site is being cloned.' );
			} else {
				title = translate( 'Currently rewinding your site' );
				description = translate( "We're rewinding your site back to %(dateTime)s.", {
					args: { dateTime },
				} );
				statusMessage =
					'queued' === status
						? translate( 'Your rewind will start in a moment.' )
						: statusText + ' ' + translate( 'Your site is being rewound.' );
			}
			break;

		case 'backup':
			title = translate( 'Currently creating a downloadable backup of your site' );
			description = translate(
				"We're creating a downloadable backup of your site at %(dateTime)s.",
				{ args: { dateTime } }
			);
			statusMessage =
				0 < percent
					? statusText + ' ' + translate( 'Your download is being created.' )
					: translate( 'The creation of your backup will start in a moment.' );
			break;
	}

	return (
		<ActivityLogBanner status="info" title={ title }>
			<div>
				{ 'restore' === action && (
					<QueryRewindRestoreStatus restoreId={ restoreId } siteId={ siteId } />
				) }
				{ 'backup' === action && (
					<QueryRewindBackupStatus downloadId={ downloadId } siteId={ siteId } />
				) }
				<p>{ description + ' ' + notifiedText }</p>
				<em>{ statusMessage }</em>
			</div>
			{ ( 'running' === status || ( 0 <= percent && percent <= 100 ) ) && (
				<ProgressBar isPulsing value={ percent || 0 } />
			) }
		</ActivityLogBanner>
	);
}

ProgressBanner.propTypes = {
	applySiteOffset: PropTypes.func.isRequired,
	percent: PropTypes.number,
	siteId: PropTypes.number,
	status: PropTypes.oneOf( [ 'queued', 'running' ] ),
	timestamp: PropTypes.string,
	action: PropTypes.oneOf( [ 'restore', 'backup' ] ),
};

export default localize( ProgressBanner );
