import React from 'react';

import { withAuthorization } from './firebase/auth';
import { tryDbGetUser, tryDbGetItemsForUser } from './firebase/db';

/**
 * Component for the authenticated user's account.
 * Displays user information and user's items.
 */
class AccountPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...AccountPage.INITIAL_STATE };
	}

	static INITIAL_STATE = {
		user: null,
		items: null,
		loading: true,
	};


	componentDidMount() {
		this.setState({ loading: true });
		const uid = this.props.uid;

		tryDbGetUser(uid) // get user info
			.then(user => {
				this.setState({ user });
				return tryDbGetItemsForUser(uid); // get items
			})
			.then(items => this.setState({ items }))
			.then(() => this.setState({ loading: false }))
			.catch(error => console.log(error.message));
	}

	render() {
		const { user, items, loading } = this.state;

		if (loading) {
			return <p>Loading...</p>;
		}

		return (
			<div>
				<h1>Account</h1>
				{loading ? <p>Loading...</p> : <User user={user} />}
				{loading ? <p>Loading...</p> : <ItemsList items={items} />}
			</div>
		);
	}
}
export default withAuthorization(AccountPage);

const User = ({ user }) => (
	<div>
		<h2>Account Info</h2>
		<p>Username: {user.username}</p>
		<p>Email: {user.email}</p>
	</div>
);

const ItemsList = ({ items }) => (
	<div className="itemslist">
		<h2>My Items</h2>
		<ul>
			{items.map(item => <li> <Item item={item} /> </li>)}
		</ul>
	</div>
);

const Item = ({ item }) => (
	<div className="item">
		<strong>Name: {item.name}, Color: {item.color}</strong>
	</div>
);
