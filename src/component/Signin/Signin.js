import React from "react";


class Signin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emailIn : '',
            passwordIn : ''
        }
    }

    onChangeEmail = (event) => {
        this.setState({emailIn: event.target.value})
    }

    onChangePassword = (event) => {
        this.setState({passwordIn: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch('https://smartbrainserver-fhye.onrender.com/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.emailIn,
                password: this.state.passwordIn
            })
        })
            .then(res => res.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user)
                    this.props.onRouteChange('home')
                }
            })
    }


    render() {
        const { onRouteChange } = this.props;
        return(
            <article className="br3 shadow-5 ba b--black-10 mv4 w-100 w-50-m w-25-1 mw6 center" >
                <main className="pa4 black-80">
                    <div className="measure ">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input 
                                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                type="email" 
                                name="email-address"  
                                id="email-address"
                                onChange={this.onChangeEmail}
                                />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input 
                                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                type="password" 
                                name="password"  
                                id="password"
                                onChange={this.onChangePassword}
                            />
                        </div>
    
                        </fieldset>
                        <div className="">
                        <input 
                            onClick={this.onSubmitSignIn} 
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                            type="submit" 
                            value="Sign in"
                        />
                        </div>
                        <div className="lh-copy mt3">
                        <p 
                            onClick={() => onRouteChange('register')} 
                            className="f6 link dim black db pointer">
                            Register
                        </p>
                        </div>
                    </div>
                </main>
            </article>
        )
    }
}

export default Signin;