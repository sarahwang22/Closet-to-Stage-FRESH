import React from 'react';

import { withAuthProtection } from './firebase/auth';
import { dbGetAllUsers } from './firebase/db';
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
		let users = [];
		dbGetAllUsers().get()
			.then(snapshot => {
				snapshot.forEach(doc => {
					users.push({ uid: doc.id, ...doc.data() });
				});
				this.setState({ users, loading: false });
			})
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
			console.log(user.username)
			return (
				<li key={user.uid}>
					{user.uid}: {user.username}, {user.email}
				</li>
			)
		})}
	</ul>
);
