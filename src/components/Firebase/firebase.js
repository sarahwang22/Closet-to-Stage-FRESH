import firebase from 'firebase/app'; //what's the diff btwn this and 'app'
import 'firebase/auth' //is this right? they used this.auth instead
import 'firebase/database'


//console.log(process.env.REACT_APP_API_KEY) //restart local program to see env changes


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
  };
  
  class Firebase {
      constructor(){
        firebase.initializeApp(firebaseConfig) //app.init

        this.auth = firebase.auth() //app.auth()
        this.db = firebase.database() //app.database
      }
      //*** Auth API ***
      doCreateUserWithEmailAndPassword = (email, password) =>
          this.auth.createUserWithEmailAndPassword(email, password)
      
      doSignInWithEmailAndPassword =(email, password) =>
          this.auth.signInWithEmailAndPassword(email, password)
      
      doSignOut = () =>
          this.auth.signOut();
      
      doPasswordReset = email =>
          this.auth.sendPasswordResetEmail(email)
      
      doPasswordUpdate = password =>
          this.auth.currentUser.updatePassword(password) //why cureentUser???
      
          //**User API */

        user = uid =>
            this.db.ref(`users/${uid}`)// ` denotes string literal ${} is how you put js in string literals
        //but wait, could you have said('users/'+uid)???
        users = () => 
            this.db.ref('users')

        currentUser = () =>
            this.auth.currentUser;

        //*Item API 

        item = uid =>
            this.db.ref(`items/${uid}`)
        
        items = () =>
            this.db.ref('items') //creates a Ref
        //dammit parenthsis, not curly quotes!!!
        
        doAddItem = (itemName, color, uid) => {
            var itemRef = this.db.ref('items/').push()

            itemRef.set({ itemName, color,})

            var itemKey = itemRef.key //ref can refer to a push(), but not push().set()

            console.log("item key "+itemKey)

            this.db.ref('users/' + uid +'/items').update({ //.set() sets, update adds
                [itemKey]: true
            })  
        }

        /*Account API */

        getUserItems = () => {

            return(
                <div></div>
            )
        }

        //*** Merge Auth and DB User Api */

        onAuthUserListener = (next, fallback) => {
            this.auth.onAuthStateChanged(authUser => { //where does authUser come from ???
                if(authUser) {
                    this.user(authUser.uid)
                        .once('value')
                        .then(snapshot => {
                            const dbUser = snapshot.val()

                            //default empty roles
                            if (!dbUser.roles){
                                dbUser.roles = {}
                            }



                            //merge auth and db user, ??? but wait why do we need to do this if it adds it to the db anyway?
                            authUser = {
                                uid: authUser.uid,
                                email: authUser.email,
                                ...dbUser,
                            }

                            next(authUser)
                        })
                } else {
                    fallback();
                }
            })
        }

        //*Get User profile */

        currentUser = () =>(
            this.auth.currentUser
        )
           
        
        
            
  }

  export default Firebase