
// console.log(window)
// const baseUrl = 'http://localhost/test-auth';


const Index = () => {

	const [user, setUser] = useState({
		email: "",
		password: "",
	})
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)
	const [authUser, setAuthUser] = useState({})
	const [mode, setMode] = useState(1)
	const [resetPass, setResetPass] = useState(false)
	const [changePassword, setChangePassword] = useState(false)
	const [resetPassSent, setResetPassSent] = useState(false)
	const [wrongPass, setWrongPass] = useState(false)
	const [userRegistered, setUserRegistered] = useState(false)


	userChangeHandler = (value, field) => {

		setUser({
			...user,
			[field]: value
		})
	}

	const options = {
		domain: 'bispoke-dev.us.auth0.com',
		clientID: client,
		// redirectUri: 'http://localhost/test-auth',
		redirectUri: baseUrl,
		responseType: 'token id_token',
		audience: `https://bispoke-dev.us.auth0.com/api/v2/`,
		
		scope: 'read:current_user update:current_user_identities update:current_user_metadata'
	};

	let webAuth = new auth0.WebAuth(options)


	const loginHandler = () => {
		setWrongPass(false)
		console.log({user})
		// return

		
		webAuth.login({
			
			username: user.email,
			password: user.password,
			realm: 'Username-Password-Authentication',
			onRedirecting: function(done) {
				console.log('On redirecting..');
				done();
			}
		},
		function(err) {
			console.error({loginHandler: {err}});
			setWrongPass(true)
			setUser({
				...user,
				password: ''
			})
		});
	}

	const checkToken = () => {
		
		
		webAuth.checkSession({
			  
		}, function (err, authResult) {
			setLoading(false)
		  // err if automatic parseHash fails
			console.log({err, authResult})
			if(authResult) {
				
				var auth0Manage = new auth0.Management({
				  domain: 'bispoke-dev.us.auth0.com',
				  token: authResult.accessToken
				});
				auth0Manage.getUser(authResult.idTokenPayload.sub, function (err,userData) {
					console.log({getUser: {err, userData}})
					if(userData) {
						setAuthUser(userData)
					}
				});

				setToken(authResult)
			}
	
		});
	}

	const changePasswordHandler =  (e, val) => {
		setChangePassword(val)
		setResetPassSent(false)
	}

	const submitNewPassword =  () => {

		webAuth.changePassword({
		    connection: 'Username-Password-Authentication',
		    email:   authUser.email,
		    
		  }, function (err, resp) {
		    if(err){
		      console.log({submitNewPassword: {err}});
		    }else{
		      console.log({submitNewPassword: {resp}});
		      setResetPassSent(true)
		    }
		  });



		return

	}

	
	const logoutHandler = async () => {
		await webAuth.logout({
		  returnTo: baseUrl,
		  clientID: client
		});

		setToken(null)
	}

	const registerHandler = (e, val) => {
		e.preventDefault()
		setMode(val)
	}

	const registerUserHandler = () => {
		console.log({registerUserHandler:  {user}})
		webAuth.signup({
			connection: "Username-Password-Authentication",
			email: user.email,
			password: user.password,

		}, function (err) {
			
			if(err) {
				console.log({registerUserHandler: {err}})
				return 

			} 

			setUserRegistered(true)
			setMode(1)
			setUser({
				...user,
				password: ''
			})
		})
	}

	const forgetPasswordHandler = () => {
		 webAuth.changePassword({
		      connection: 'Username-Password-Authentication',
		      email:   user.email
		    }, function (err, resp) {
		      if(err){
		        console.log(err.message);
		      }else{
		        console.log(resp);
		        setResetPass(true)
		      }
		    });

	}

	const passwordChangeHandler = (value, field) => {

		setPassword({
			...password,
			[field] : value

		})
	}


	useEffect(() => {
		// logoutHandler()
		checkToken()




	}, [])


useEffect(() => {
	
	if([2, 3].includes(mode)) {
		setUser({
			...user,
			password: '',
			email: ''
		})
	}
		
		
	}, [mode])
	
	

	return (
		<div hidden={loading}>
			<div hidden={mode != 1}>
				{token ? 
				<div>
				{changePassword ? 
					<div>
						<p>change password<br/> 

						{resetPassSent ? 
						<span>a reset password link has been sent to your email</span>
						:
						<span>send reset password to email</span>
						}</p>

						
						<button hidden={resetPassSent} onClick={submitNewPassword}>send</button>
						<br/>
						<a href="#" onClick={e => changePasswordHandler(e, false)}>{resetPassSent ? 'back':'cancel'}</a>

					</div>
				:
					<div>
						<p>Logged in</p>
						<p>
						email: {authUser.email} <br/>
						user id: {authUser.user_id} <br/>
						name: {authUser.nickname} <br/>
						email verfied: {authUser.email_verified ? 'yes' : 'no'} <br/>

						</p>
						<button onClick={logoutHandler}>logout</button>
						<br/>
						<a href="#" onClick={e => changePasswordHandler(e, true)}>change password</a>
						<hr/>
						<NeonPage />
					</div>
				}
					

				</div>
				:
				<div>
					<p>Login<br/>{wrongPass ? 'wrong email or password' :null}{userRegistered ? 'registration successfull': null}</p>
					<input placeholder="email" type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, 'email')}/>
					<br/>
					
					<input placeholder="password" type="password" value={user.password} onChange={e => userChangeHandler(e.target.value, 'password')}/>
					<br/>
					<button onClick={loginHandler}>login</button>
					<br/>
					<a href="#" onClick={(e) =>registerHandler(e, 2)}>sign up</a>
					<br/>
					<a href="#" onClick={(e) =>registerHandler(e, 3)}>forget password</a>
				</div>

				}
			</div>
			<div hidden={mode != 2}>
				<p>register</p>
				<input placeholder="email" type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, 'email')}/>
				<br/>
				
				<input placeholder="password" type="password" value={user.password} onChange={e => userChangeHandler(e.target.value, 'password')}/>
				<br/>
				<button onClick={registerUserHandler}>register</button>
				<br/>
				<a href="#" onClick={(e) =>registerHandler(e,1)}>cancel</a>
			</div>
			<div hidden={mode != 3}>
				<p>forget password</p>
				{resetPass ?

				
				
				<div>
					<p> password reset email sent to your email</p>
					<br/>
					<a href="#" onClick={(e) =>registerHandler(e,1)}>back</a>

				</div>
				:
				<div>
					
					<input placeholder="email" type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, 'email')}/>

					<button onClick={forgetPasswordHandler}>submit</button>
					<br/>
					<a href="#" onClick={(e) =>registerHandler(e,1)}>cancel</a>
				</div>
				}
				
			</div>
			
			
			

		</div>
	)
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
	
		<Index />
	
);

