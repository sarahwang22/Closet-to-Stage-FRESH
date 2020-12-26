import React from 'react'

import {withFirebase} from '../Firebase/index'
import {AuthUserContext} from '../Session'

const withAuthentication = Component =>{
    class WithAuthentication extends React.Component{
        constructor(props){
            super(props);
        
            this.state = {
              authUser: null,
            }
          }
        
          componentDidMount () { 
            this.listener = this.props.firebase.onAuthUserListener(
              authUser=>{
                this.setState({authUser})
              },
              ()=>{
                this.setState({authUser: null})
              }
            )//listener is triggered every time data changes !!! OH
              
          }
        
          componentWillUnmount () {
            this.props.firebase.user().off(); //I don't understand listeners !!! ???why this/props (below) huh wait this works
          }
        render(){
            return(
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} /> 
                </AuthUserContext.Provider>
                
            )
        }
    }
    return withFirebase(WithAuthentication) //WHY ??? does this work
}

export default withAuthentication