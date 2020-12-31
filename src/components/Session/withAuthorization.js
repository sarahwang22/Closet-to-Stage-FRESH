import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose' //??? still don't really understand this

import {withFirebase} from '../Firebase'
import * as ROUTES from '../../constants/routes'
import AuthUserContext from './context'

const withAuthorization = condition => Component => { //??? why would this need to be curried? bc you asked for it 
    class WithAuthorization extends React.Component { //syntax for classes is Name {}
        componentDidMount(){
            this.listener = this.props.firebase.onAuthUserListener(
                authUser => {
                    if(!condition(authUser)) {
                        this.props.history.push(ROUTES.SIGN_IN)
                    }
                },
                () => {
                    this.props.history.push(ROUTES.SIGN_IN)
                    console.log("not an admin")
                    console.log(this.props.firebase.user())
                },
            )
        }

        componentWillUnmount(){
            //this.props.firebase.user().off(); //!!! needs a fixing
        }

        render(){
            console.log({...this.props})
            return (
            <AuthUserContext.Consumer>
                {authUser => 
                    condition(authUser)? <Component {...this.props} />:null}
            </AuthUserContext.Consumer> )
            //ya always need this.props, i think, unless it's a class
        }
    }

    return compose(
        withRouter,
        withFirebase,
    ) (WithAuthorization)
}

export default withAuthorization

//note to self: research role-based authorization