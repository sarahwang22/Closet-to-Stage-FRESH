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
    

    this.unsubscribe = this.props.firebase.users()
      .onSnapshot(snapshot => { //use this.onSnapshot for instant changes (get() makes you log back in and out for changes)
        let users = []

        snapshot.forEach(doc=>{
            users.push({uid: doc.id, ...doc.data()})
      })

      this.setState({
        users,
        loading: false,
      })
    })
    //console.log(this.state.users) //come back to fix usersList => users

    

    
    console.log(ROLES.ADMIN) //it's clearly defined...

    /* this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val() //usersObject is an Object
      console.log(usersObject)

      const usersList = Object.keys(usersObject).map(key=>({ //puts all of the users in an array ({John:, Mary:, ...})
          ...usersObject[key],// usersObject[John]
          uid: key,
      }))
      //console.log(usersList)
      this.setState({
          users: usersList,
          loading: false,
      })
    }) */
  }
 
  componentWillUnmount() {
      this.unsubscribe()
      //this.props.firebase.user().off()//"not a function"
  }
  render() {
      const { users, loading } = this.state
      console.log(users)

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

const UserList = ({users}) => {

  return ( 
    <ul>
    {users.map(user=>{
      console.log(user.username)
      return(
        <li key={user.uid}>
          {user.uid}: {user.username}, {user.email}
        </li>
      )
      
    }
        
    )}
  </ul>
  )
}
  
    

const condition = authUser => (
  authUser && authUser //needs fixing
)
  
  

  

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage) //need to study compose

