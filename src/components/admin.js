import React from 'react';

import { withAuthorization } from './firebase/auth';
import { tryDbGetAllUsers } from './firebase/db';
import * as ROLES from '../constants/roles';

/**
 * Utility page for users with the 'admin' role.
 * Displays a list of all users.
 */
class AdminPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...AdminPage.INITIAL_STATE };
	}

	static INITIAL_STATE = {
		users: null,
		loading: true,
	};

	componentDidMount() {
		tryDbGetAllUsers()
			.then(users => this.setState({ users }))
			.then(() => this.setState({ loading: false }))
			.catch(error => alert(error.message));
	}

	render() {
		const { users, loading } = this.state;

		return (
			<div>
				<h1>Admin</h1>
				<p>The Admin Page is accessible by every signed in admin user</p>
				{loading ? <p>Loading...</p> : <UserList users={users} />}
			</div>
		);
	}
}
export default withAuthorization(AdminPage, [ROLES.ADMIN]);

/**
 * Component to render a list of users.
 * Requires a prop 'users': string[].
 */
const UserList = ({ users }) => (
	<ul>
		{users.map(user => {
			return (
				<li key={user.uid}>
					{user.uid}: {user.username}, {user.email}
				</li>
			)
		})}
	</ul>
);
