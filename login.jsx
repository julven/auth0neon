const Login = () => {

	const {loginLoaded, setLoginLoaded ,

		marketplaceList, setMarketplaceList,
		getMarketPlace
	} = useContext(AppContext)


	const [user, setUser] = useState({
		email: "",
		password: "",
		confirm: "",
		fname: "",
		lname: "",
		aname: "",
		marketplace: "",

	})
	const [wrongPass, setWrongPass] = useState(false)	
	const [userRegistered, setUserRegistered] = useState(false)
	const [resetPass, setResetPass] = useState(false)
	const [mode, setMode] = useState(1)
	const [errList, setErrList] = useState([])
	const [ generalError, setGeneralError] = useState("")
	

	const loginHandler = () => {
		setWrongPass(false)
		setGeneralError("")
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
			setGeneralError(err.description || "")
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
		// console.log({registerUserHandler:  {user}})
		// return
		setErrList([])
		setGeneralError("")


		let valid = true, errors = []


		if(user.password != user.confirm) {
			setGeneralError("Confirm and Paswword did not match.")
			return
		}


		Object.keys(user).forEach( x => {
			if(user[x] == "" && x!= "lname") {
				console.log({[x] : user[x]})
				valid = false
				errors.push(x)
			}
		})
		setErrList(errors)
		if(!valid) return

			// return

		webAuth.signup({
			connection: "Username-Password-Authentication",
			email: user.email,
			password: user.password,
			user_metadata: {
				fname: user.fname,
				lname: user.lname,
				aname: user.aname,
				role: "owner",
				marketplace_id: user.marketplace
			}
		}, function (err) {
			
			if(err) {
				console.log({registerUserHandler: {err}})
				setGeneralError(() => {
		        	if(err.code == "invalid_password") {
		        		return err.policy
		        	}

		        	return "invalid password"
		        })
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
		setGeneralError("")
		 webAuth.changePassword({
		      connection: 'Username-Password-Authentication',
		      email:   user.email
		    }, function (err, resp) {
		      if(err){
		        console.log({forgetPasswordHandler: {err}});
		        setGeneralError(err.description || "error! please try again.")
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
		getMarketPlace()
	}, [])

	useEffect(() => {
		console.log({marketplaceList})
	}, [marketplaceList])

	if(ui) return (
		<div  className="login-bg ">
			<UiLogin 
			loginLoaded={loginLoaded}
			mode={mode}
			wrongPass={wrongPass}
			userRegistered={userRegistered}
			user={user}
			userChangeHandler={userChangeHandler}
			loginHandler={loginHandler}
			generalError={generalError}
			errList={errList}
			registerUserHandler={registerUserHandler}
			registerHandler={registerHandler}
			forgetPasswordHandler={forgetPasswordHandler}
			marketplaceList={marketplaceList}
			setMarketplaceList={setMarketplaceList}
			resetPass={resetPass}
			/>
		</div>
		)
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
					{generalError != "" && <p>{generalError}</p>}
					<input placeholder="email" type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, 'email')}/>
					{errList.includes("email") && <>&nbsp; required</>}<br/><br/>
					
					<input placeholder="password" type="password" value={user.password} onChange={e => userChangeHandler(e.target.value, 'password')}/>
					{errList.includes("password") && <>&nbsp; required</>}<br/><br/>

					<input placeholder="first name" type="text" value={user.fname} onChange={e => userChangeHandler(e.target.value, 'fname')}/>
					{errList.includes("fname") && <>&nbsp; required</>}<br/><br/>

					<input placeholder="last name" type="text" value={user.lname} onChange={e => userChangeHandler(e.target.value, 'lname')}/>
					{errList.includes("lname") && <>&nbsp; required</>}<br/><br/>

					<input placeholder="business/agency name" type="text" value={user.aname} onChange={e => userChangeHandler(e.target.value, 'aname')}/>
					{errList.includes("aname") && <>&nbsp; required</>}<br/><br/>

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