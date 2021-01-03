import React from 'react';

import { withAuthProtection } from './firebase/auth';
import { tryDbGetAllUsers } from './firebase/db';
import * as ROLES from '../constants/roles';

class AdminPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			users: [],
			loading: true,
		};
	}

	componentDidMount() {
		tryDbGetAllUsers()
			.then(users => {
				this.setState({ users });
			})
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
export default withAuthProtection(AdminPage, [ROLES.ADMIN]);

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
