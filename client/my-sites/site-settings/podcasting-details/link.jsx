/** @format */

/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import Gridicon from 'gridicons';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Button from 'components/button';
import SectionHeader from 'components/section-header';
import PodcastFeedUrl from './feed-url';
import PodcastingPrivateSiteMessage from './private-site';
import PodcastingSupportLink from './support-link';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import isPrivateSite from 'state/selectors/is-private-site';
import { getTerm } from 'state/terms/selectors';

class PodcastingLink extends Component {
	render() {
		const { isPodcastingEnabled, translate } = this.props;

		const classes = classnames( 'podcasting-details__link', {
			'is-enabled': isPodcastingEnabled,
		} );

		return (
			<div className={ classes }>
				<SectionHeader label={ translate( 'Podcasting' ) } />
				<Card className="podcasting-details__link-card">{ this.renderCardBody() }</Card>
			</div>
		);
	}

	renderCardBody() {
		const {
			isPrivate,
			isPodcastingEnabled,
			categoryName,
			feedUrl,
			detailsLink,
			translate,
		} = this.props;

		if ( isPrivate ) {
			return <PodcastingPrivateSiteMessage />;
		}

		if ( ! isPodcastingEnabled ) {
			return (
				<div className="podcasting-details__link-action-container">
					<div className="podcasting-details__link-info">
						{ translate(
							'Publish a podcast feed to Apple Podcasts and other podcasting services.'
						) }
						<br />
						<PodcastingSupportLink />
					</div>
					<Button className="podcasting-details__link-button" href={ detailsLink }>
						{ translate( 'Set Up' ) }
					</Button>
				</div>
			);
		}

		return (
			<Fragment>
				<div className="podcasting-details__link-action-container">
					<div className="podcasting-details__link-info">
						<Gridicon icon="microphone" size={ 24 } />
						<span className="podcasting-details__link-info-text">
							{ translate(
								'Publish blog posts in the {{strong}}%s{{/strong}} category to add new episodes.',
								{
									args: categoryName,
									components: { strong: <strong /> },
								}
							) }
						</span>
					</div>
					<Button className="podcasting-details__link-button" href={ detailsLink }>
						{ translate( 'Manage Details' ) }
					</Button>
				</div>
				<div className="podcasting-details__link-feed">
					<PodcastFeedUrl feedUrl={ feedUrl } />
				</div>
			</Fragment>
		);
	}
}

export default connect( ( state, ownProps ) => {
	const { fields } = ownProps;

	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state );

	const podcastingCategoryId = Number( fields && fields.podcasting_category_id );
	const podcastingCategory =
		podcastingCategoryId > 0 && getTerm( state, siteId, 'category', podcastingCategoryId );

	const detailsLink = `/settings/podcasting/${ siteSlug }`;

	return {
		siteSlug,
		isPrivate: isPrivateSite( state, siteId ),
		isPodcastingEnabled: !! podcastingCategory,
		categoryName: podcastingCategory && podcastingCategory.name,
		feedUrl: podcastingCategory && podcastingCategory.feed_url,
		detailsLink,
	};
} )( localize( PodcastingLink ) );
