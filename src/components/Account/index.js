import React, { Component } from 'react';
import {compose} from 'recompose'

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session'
import * as ROLES from '../../constants/roles'
import PasswordChangeForm from '../PasswordChange'
 
class AccountPage extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      user: {},
      loading: false,
      items: [],
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });

    var cuser = this.props.firebase.currentUser()

    if(cuser != null){
        var cuid = cuser.uid;
        //console.log(cuid)
        
        this.props.firebase.user(cuid).on("value", snapshot => {
            const userObject = snapshot.val();
            console.log(userObject)

            this.setState({user: userObject, loading: false})
        }
        )

        //this.props.firebase.database().ref('users') error
    }
    

  }
 
  componentWillUnmount() {
      this.props.firebase.user().off()//removes the listener???
  }
  render() {
      const { user, loading } = this.state

    return (
      <div>
        <h1>Account</h1>
        <p>Account details</p>
        
        {loading && <p>Loading...</p>}
        <PasswordChangeForm/>
        <User user={user} />


      </div>
    );
  }
}

const User = ({user}) => ( 
    //completely don't understand ???
    <div>
      <ul>   
          <li >
              <span>
                  <p>Email:</p>{user.email}
              </span>
              <span>
                  <p> username:</p>{user.username}
              </span>
          </li>     
      </ul>

    </div>
    

)
 


const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(AccountPage) //need to study compose

