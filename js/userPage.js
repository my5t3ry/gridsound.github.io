"use strict";

const userPage = {
	init() {
		this._username = "";
		DOM.userPageUserEmailNot.onclick = this._resendEmailBtnClick.bind( this );
		router.on( [ "u" ], path => {
			const username = path[ 1 ].toLowerCase();

			if ( username !== this._username ) {
				const itsMe = username === apiClient.user.usernameLow,
					prom = itsMe
						? Promise.resolve( apiClient )
						: apiClient.getUser( username );

				DOM.loader.classList.add( "show" );
				prom
				.finally( () => DOM.loader.classList.remove( "show" ) )
				.then( res => {
					this._username = username;
					this._updateUser( res.user );
					this._updateComposition( res.compositions );
				}, res => {
					this._username = "";
					errorPage.show( res.code );
				} );
			}
		} );
	},

	// private:
	_updateUser( u ) {
		console.log( u );
		if ( u.id === apiClient.user.id ) {
			DOM.userPageUserEmailAddr.classList.toggle( "private", u.emailpublic !== u.email );
		}
		DOM.userPageUserEmail.classList.toggle( "toVerify", u.status === "EMAIL_TO_VERIFY" );
		DOM.userPageUserEmailAddr.textContent = u.email;
		DOM.userPageUserUsername.textContent = u.username;
		DOM.userPageUserLastname.textContent = u.lastname;
		DOM.userPageUserFirstname.textContent = u.firstname;
		DOM.userPageUserAvatar.style.backgroundImage = u.avatar
			? `url("${ u.avatar }?s=120")`
			: "none";
	},
	_updateComposition( cmps ) {
		console.log( cmps );
	},
	_resendEmailBtnClick() {
		const btn = DOM.userPageUserEmailNot,
			done = btn.classList.contains( "loading" ) ||
				btn.classList.contains( "sended" );

		if ( !done ) {
			btn.classList.add( "loading" );
			apiClient.resendConfirmationEmail()
				.finally( () => btn.classList.remove( "loading" ) )
				.then( () => btn.classList.add( "sended" ) );
		}
	},
};
