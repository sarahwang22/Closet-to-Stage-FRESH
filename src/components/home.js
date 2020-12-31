import React from 'react'
import { withAuthProtection } from './firebase/auth';

/**
 * Dashboard for authenticated users.
 */
const HomePage = () => {
	return (
		<div>
			<h1>Home Page</h1>
			<p> The Home Page is accessible by every signed-in user</p>
		</div>
	)
}
export default withAuthProtection(HomePage);
