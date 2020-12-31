import React, {Component } from 'react';
import {compose} from 'recompose'

import { withFirebase } from '../Firebase';
import {withAuthorization} from '../Session'
//import * as ROLES from '../../constants/roles'
import PasswordChangeForm from '../PasswordChange'
import ItemEdit from '../ItemEdit'
 
class AccountPage extends Component {
  constructor(props) {
    super(props);
 
    
    this.state = {
      user: {},
      loading: false,
      userItems: [],
    };
  }
 
  componentDidMount() {
    this.setState({ loading: true });

    var cuser = this.props.firebase.currentUser()
    console.log(cuser)

    if(cuser != null){ //but do you really need this? because account can only be accessed by auth users
        var cuid = cuser.uid;
        //console.log(cuid)
        
        this.unsubscribe = this.props.firebase.user(cuid)
          .onSnapshot(snapshot => { //or change back to .get
            if(snapshot){//need???
              this.setState({
                user: snapshot.data(),
                loading: false
              })
              //console.log(this.state.user)
            }  
          })
          
          this.props.firebase.user(cuid) //how to get data once
            .get()
            .then(doc=>{
              //console.log(doc.data())
            })

            this.props.firebase.userItems(cuid) //collection, not a doc
              .get()
              .then(snapshot=>{
                let userItems =[]

                snapshot.forEach(doc => {
                  userItems.push({itemID: doc.id, ...doc.data()})
                })
                
                //console.log(userItems)

                this.setState({userItems})
              })

        /* this.props.firebase.user(cuid).on("value", snapshot => {
            const userObject = snapshot.val();
            
            const userObjectItems = userObject["items"]

            if(userObjectItems){
              const allItemsRef = this.props.firebase.items()

              allItemsRef.on('value', snapshot =>{
                const allItemsObject = snapshot.val()

                const itemsList = Object.keys(userObjectItems).map((itemID)=>({
                    ...allItemsObject[itemID],
                    itemID: itemID
                }))

                this.setState({userItems: itemsList})
                console.log(this.state.userItems)

              })
            }
            this.setState({user: userObject, loading: false, })
        }
        ) */
    }
  }
 
  componentWillUnmount() {
      this.unsubscribe()
      //this.props.firebase.users().off()//removes the listener??? or user().off()
  }
  render() {
      const { user, loading, userItems } = this.state
 
    return (
      <div>
        <h1>Account</h1>
        <p>Account details</p>
        
        {loading && <p>Loading...</p>}
        <PasswordChangeForm/>
        <User user={user} />

        <a href="/itemform"> Add Item</a>

        <ItemsList items = {userItems} />

      </div>
    );
  }
}

const User = ({user}) => ( 
    <div>
      <ul>   
          <li >
              <span>
                  <p>Email: {user.email}</p>
              </span>
              <span>
                  <p> username: {user.username}</p>
              </span>
          </li>     
      </ul>

    </div>
)

const ItemsList = ({items}) => {
  //console.log(items)

  return (
    <div className="itemslist">
      <ul>
        {items.map(item=> <li key={item.itemID}> <ItemEdit item={item}/> </li>)} 
        {/* ItemEdit recieves prop object that looks like
        {
          item: {
            itemID: #,
            item: {
              description:,
              color:,
              etc.
            }
          }
        } */}
      </ul>
    </div>
  )
}

/* const Item =  (props) =>{ //or use ({item}) instead of (props) and change accoridngly
  //console.log(props.item)
return(
    <div className="item">
      <strong>itemName: {props.item.item.itemName}, color: {props.item.item.color} </strong>
    </div>
  )
} */
 


const condition = authUser => !! authUser

export default compose(
  withFirebase,
  withAuthorization(condition), //somehow this fixed my staying logged in error???
)(AccountPage) //need to study compose

