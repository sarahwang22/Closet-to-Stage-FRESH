import React, {Component} from 'react'

class Filter extends Component{
    constructor(props){
        super(props)
        this.state={
            type:{}, //type: {dress: true, top: false, ...}
            brand:{},
        }
    }
    onClick = (spec) => (event) => { //can't push an item to state (can't mutate), should use concat
        // spec is type, brand, etc.

        const checkbox = document.getElementById(event.target.id)

        if(checkbox.checked) { // {list:{dress: true}}
            this.setState({
                [spec]:{
                    ...this.state[spec],
                    [event.target.name]: true
                }
            })
        }
        else{
            this.setState({ // {list:{dress: false}}
                [spec]:{
                    ...this.state[spec],
                    [event.target.name]: false
                }
            })
        }

        console.log(this.state)


       /*  this.setState(state =>{
            const list = state[spec].concat(event.target.value)

            return {
                [spec]: list,
            }
        })
        */
        
    }

    onSubmit = () => {
        let querySpec = [];

        Object.entries(this.state).map(([spec, specObj]) =>{
            

        }   
        )
    }

    render(){
        return(
            <div>
                <form>
                    <h5>type</h5>
                        <label for="dress">dress</label>
                        <input class="type" type="checkbox" id="dress" name="dress" value="dress" onClick={this.onClick("type")}/>
                        <label for="bottom">bottom</label>
                        <input class="type" type="checkbox" id="bottom" name="bottom" value="bottom" onClick={this.onClick("type")}/>
                        <label for="top">top</label>
                        <input class="type" type="checkbox" id="top" name="top" value="top" onClick={this.onClick("type")}/>
                    <h5>brand</h5>
                        <label for="costco">costco</label>
                        <input type="checkbox" id="coscto" name="costco" value="costco" onClick={this.onClick("brand")}/>
                        <label for="capezio">capezio</label>
                        <input type="checkbox" id="capezio" name="capezio" value="capezio" onClick={this.onClick("brand")}/>
                </form>
            </div>
        )
    }
}

export default Filter
