import React, {Component} from 'react'
import { Redirect, Link} from 'react-router-dom'


class Test extends Component{
    constructor(props){
        super(props)

        this.state = {
            clicked: false
        }
    }

    onClick = () => {

        this.setState({
            clicked: !this.state.clicked
        })
    }

    render(){
        const {clicked} = this.state

        if(clicked) {
            return(
                <Redirect to="/redirect"/>
            )
        }
        else {
            return (
                <div>
                    <button onClick={this.onClick}>Click me</button>
                    <br></br>

                    <button onClick={this.routeChange}> New Path (router test)</button>
                    <br></br>

                    link practice: 
                    <Link to="/new/page/woop">ah</Link>

                </div>
                
            )
        } 
    }  
}

export default Test