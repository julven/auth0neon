const Login = () => {

	const {loginLoaded, setLoginLoaded } = useContext(AppContext)


	const [user, setUser] = useState({
		email: "",
		password: "",
	})
	const [wrongPass, setWrongPass] = useState(false)	
	const [userRegistered, setUserRegistered] = useState(false)
	const [resetPass, setResetPass] = useState(false)
	const [mode, setMode] = useState(1)
	

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
			setLoginLoaded(true)
			console.error({loginHandler: {err}});
			setWrongPass(true)
			setUser({
				...user,
				password: ''
			})
		});
	}

	const userChangeHandler = (value, field) => {

		setUser({
			...user,
			[field]: value
		})
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

	useEffect(() => {
	
	if([2, 3].includes(mode)) {
		setUser({
			...user,
			password: '',
			email: ''
		})
	}
		
		
	}, [mode])


	useEffect(() => {
		console.log({webAuth})
	}, [])

	return (
		<div>
			{loginLoaded ? 
			<div>
				{mode == 1 ? 
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
				:
				mode == 2 ?
				<div>
					<p>register</p>
					<input placeholder="email" type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, 'email')}/>
					<br/>
					
					<input placeholder="password" type="password" value={user.password} onChange={e => userChangeHandler(e.target.value, 'password')}/>
					<br/>
					<button onClick={registerUserHandler}>register</button>
					<br/>
					<a href="#" onClick={(e) =>registerHandler(e,1)}>cancel</a>
				</div>
				:
				mode == 3 ?
				<div>
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
				:
				null

				}


			</div>
			:
			<p>loading...</p>
			}
		</div>
		
	)
}