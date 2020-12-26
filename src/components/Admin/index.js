import React, { Component } from 'react';
import {compose} from 'recompose'

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session'
import * as ROLES from '../../constants/roles'
 
class AdminPage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      loading: false,
      users: [],
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });
 
    this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val() //usersObject is an Object
        
        //console.log(usersObject)

        const usersList = Object.keys(usersObject).map(key=>({ //puts all of the users in an array ({John:, Mary:, ...})
            ...usersObject[key],// usersObject[John]
            uid: key,
        }))

       //console.log(usersList)

        this.setState({
            users: usersList,
            loading: false,
        });

    });
  }
 
  componentWillUnmount() {
      this.props.firebase.user().off()//removes the listener???
  }
  render() {
      const { users, loading } = this.state

    return (
      <div>
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in admin user</p>
        
        {loading && <p>Loading...</p>}
        
        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({users}) => ( 
    //completely don't understand ???
    <ul>
        {users.map(user=> (
            <li key={user.uid}>
                <span>
                    <strong>ID:</strong> {user.uid}
                </span>
                <span>
                    <strong> E-mail:</strong> {user.email}
                </span>
                <span>
                    <strong> Username:</strong> {user.username}
                </span>
            </li>     
        ))}
    </ul>
)
 
const condition = authUser =>
  authUser && !!authUser.roles[ROLES.ADMIN]

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage) //need to study compose

