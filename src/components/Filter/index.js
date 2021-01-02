import React, {Component} from 'react'

import {withFirebase} from '../Firebase'

class Filter extends Component{
    constructor(props){
        super(props)
        this.state={
            filters:{
                type:{}, //type: {dress: true, top: false, ...}
                brand:{},
            },
            filtItemsList:[],
        }
    }

    onClick = (spec) => (event) => { //can't push an item to state (can't mutate), should use concat
        // spec is type, brand, etc.

        const checkbox = document.getElementById(event.target.id)

        if(checkbox.checked) { // {list:{dress: true}}
            this.setState({
                filters:{
                    ...this.state.filters, //used ... before new addition instead of after and worked
                    [spec]:{
                        ...this.state.filters[spec],
                        [event.target.name]: true
                    },
                }
            })
        }
        else{
            this.setState({ // {list:{dress: false}}
                filters:{
                    ...this.state.filters,
                    [spec]:{
                        ...this.state.filters[spec],
                        [event.target.name]: false
                    },     
                }  
            })
        }

        console.log('old state: ',this.state)
       /*  this.setState(state =>{
            const list = state[spec].concat(event.target.value)
            return {
                [spec]: list,
            }
        })
        */
    }

    onSubmit = (event) => {
        /*
            brand(spec): (specObj){
                costco(key): true(value),
                capezio: false,
            }
         */
        Object.entries(this.state.filters).map(([spec, specObj]) =>{
            console.log(spec, specObj)

            let querySpec =[];

            Object.entries(specObj).map(([key,value]) => {
                if(value)
                    querySpec.push(key)
                //console.log(querySpec)
                //querySpec is an array that holds all of the specs want to query for,
                //within a certain field, like brand or type
            })
            console.log(querySpec)

            //queries with filter arrays
            //where('brand', 'in', [costco, capezio, ...])
             this.props.firebase.items().where(spec,'in', querySpec)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc=>{

                        this.setState(state=>{
                            const list = state.filtItemsList.concat({itemID: doc.id, ...doc.data()})

                            return({
                                ...state,
                                filtItemsList:list
                            })
                        }) 
                        
                    })

                })   
        }
        )

        console.log('onSubmit state: ',this.state)

        event.preventDefault()
        
    }

    render(){
        const {filters, filtItemsList} = this.state

        console.log('filters.type.dress:', filters.type.dress)

        return(
            <div>
                <form>
                    <h5>type</h5>
                        <label htmlFor="dress">dress</label>
                        <input className="type" type="checkbox" id="dress" name="dress" value="dress" checked={!!filters.type.dress} onClick={this.onClick("type")}/>
                        <label htmlFor="bottom">bottom</label>
                        <input className="type" type="checkbox" id="bottom" name="bottom" value="bottom" checked={!!filters.type.bottom} onClick={this.onClick("type")}/>
                        <label htmlFor="top">top</label>
                        <input className="type" type="checkbox" id="top" name="top" value="top" onClick={this.onClick("type")}/>
                    <h5>brand</h5>
                        <label htmlFor="costco">costco</label>
                        <input type="checkbox" id="coscto" name="costco" value="costco" onClick={this.onClick("brand")}/>
                        <label htmlFor="capezio">capezio</label>
                        <input type="checkbox" id="capezio" name="capezio" value="capezio" onClick={this.onClick("brand")}/>
                    <button onClick={this.onSubmit}>Submit</button>
                </form>
                <FiltItemsList items = {filtItemsList}/>
            </div>
        )
    }
}

const FiltItemsList = (props) =>{

    console.log(props)

    return(
        <div>
            {props.items.map(item=> {
                <h1>{item.itemID}</h1>
            })}
        </div>
    )
}

export default withFirebase(Filter)
