/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import sitesController from 'my-sites/controller';
import controller from './controller';
import config from 'config';

module.exports = function() {
	page( '/post', controller.pressThis, sitesController.siteSelection, sitesController.sites );
	page( '/post/new', () => page.redirect( '/post' ) ); // redirect from beep-beep-boop
	page( '/post/:site?/:post?', sitesController.siteSelection, controller.post );
	page.exit( '/post/:site?/:post?', controller.exitPost );

	page( '/page', sitesController.siteSelection, sitesController.sites );
	page( '/page/new', () => page.redirect( '/page' ) ); // redirect from beep-beep-boop
	page( '/page/:site?/:post?', sitesController.siteSelection, controller.post );
	page.exit( '/page/:site?/:post?', controller.exitPost );

	if ( config.isEnabled( 'manage/custom-post-types' ) ) {
		page( '/edit/:type', sitesController.siteSelection, sitesController.sites );
		page( '/edit/:type/new', ( context ) => page.redirect( `/edit/${ context.params.type }` ) );
		page( '/edit/:type/:site?/:post?', sitesController.siteSelection, controller.post );
		page.exit( '/edit/:type/:site?/:post?', controller.exitPost );
	}
};
