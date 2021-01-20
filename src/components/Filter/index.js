import React, {Component} from 'react'
import {compose} from 'recompose'
import { withRouter, Redirect } from 'react-router-dom'
//must use withRouter in order to use this.props.history.push("/path")

import {withFirebase} from '../Firebase'

class Filter extends Component{
    constructor(props){
        super(props)
        this.state={
            filters:{
                type:{}, //type: {dress: true, top: false, ...}
                brand:{},
            },
            filtItemsIDs:[],
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

            querySpec ==> ['costco']

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
            if(querySpec.length > 0){
                this.props.firebase.items().where(spec,'in', querySpec)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc=>{

                        this.setState(state=>{
                            /* const filtItem = {itemID: doc.id, ...doc.data()}//probably need to fix with .where, somehow

                            let list =[]

                            if(!this.state.filtItemsList.includes(filtItem))
                                list = state.filtItemsList.concat(filtItem) */
                            /*const addition = [{itemID: doc.id, ...doc.data()}]
                            const oldList = state.filtItemsList
                            let newList = oldList.concat(addition)
                            not working, trying to makie a unique array
                            */

                            //newList = [...new Set([...oldList,...addition])]
                            
                            const addition = [doc.id]
                            const oldList = state.filtItemsIDs

                            let newIDs = addition.concat(oldList)

                            newIDs = [...new Set([...addition, ...oldList])]


                            return({
                                ...state,
                                filtItemsIDs: newIDs,
                            })
                        }) 
                        
                    })

                })   

            }
        }
        )

        console.log('onSubmit state: ',this.state)

        event.preventDefault()
        
    }

    routeChange = () => {
        
        this.props.history.push("/new/page") //better than Redirect (which doesn't work here anyway)
    }

    render(){
        const {filtItemsIDs} = this.state

        return(
            <div>
                <form>
                    <button onClick={this.routeChange}> New Path (router test)</button>
                    <h5>type</h5>
                        <label htmlFor="dress">dress</label>
                        <input className="type" type="checkbox" id="dress" name="dress" value="dress"  onClick={this.onClick("type")}/>
                        <label htmlFor="bottom">bottom</label>
                        <input className="type" type="checkbox" id="bottom" name="bottom" value="bottom" onClick={this.onClick("type")}/>
                        <label htmlFor="top">top</label>
                        <input className="type" type="checkbox" id="top" name="top" value="top" onClick={this.onClick("type")}/>
                    <h5>brand</h5>
                        <label htmlFor="costco">costco</label>
                        <input type="checkbox" id="coscto" name="costco" value="costco" onClick={this.onClick("brand")}/>
                        <label htmlFor="capezio">capezio</label>
                        <input type="checkbox" id="capezio" name="capezio" value="capezio" onClick={this.onClick("brand")}/>
                    <button onClick={this.onSubmit}>Submit</button>
                </form>
                <FiltItemsList itemIDs = {filtItemsIDs}/>
                <h1>hello</h1>
            </div>
        )
    }
}

const FiltItemsList = (props) =>{
    console.log(props)
    return(
        <div>
            <ul>
                {props.itemIDs.map(id=> 
                    <li>{id}, </li>
                )}
            </ul>
        </div>
    )
}

export default compose( //have to use compose to use both withRouter and withFirebase (something about props)
    withRouter,
    withFirebase
) (Filter)

