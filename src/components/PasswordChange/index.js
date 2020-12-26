import React, {Component} from 'react'
//want to separate by react, then imported functions
import { withFirebase } from '../Firebase'


const INITIAL_STATE = {
    passwordOne:'',
    passwordTwo:'',
    error: null,
}
class PasswordChangeFormBase extends Component {
    constructor(props){
        super(props)

        this.state ={...INITIAL_STATE }
    }

    onSubmit=(event)=>{
        const {passwordOne} = this.state

        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(()=> {
                this.setState({...INITIAL_STATE})
            })
            .catch(error=>{ //catch takes a function, with the error as a param
                this.setState({error})
            })
       
        event.preventDefault()
    }

    onChange=(event)=>{
        this.setState({[event.target.name]: event.target.value})
        //unecesarry newlines
    }
    render(){
        const {passwordOne, passwordTwo, error} = this.state

        const isInvalid = 
            passwordOne!==passwordTwo || passwordOne===''// render takes care of the errors, disables button if so 

        return(
       //don't need a div dividerf
            <form onSubmit={this.onSubmit}>
                <input
                    name="passwordOne"
                    value={passwordOne} //or this.state.passwordOne
                    onChange={this.onChange}
                    type="password"
                    placeholder="New Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm New Password"
                />
                <button disabled={isInvalid} type="submit">
                    Reset My Password
                </button>
                
                {error && <p>{error.message}</p>}
            </form>
            )
    }
}

const PasswordChangeForm = withFirebase(PasswordChangeFormBase)

export default PasswordChangeForm //you really don't need the page, just the form