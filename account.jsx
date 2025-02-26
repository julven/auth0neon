const Account = () => {

	const {
		authUser, setAuthUser,
		neonUser
	} = useContext(AppContext)

	const [resetPassSent, setResetPassSent] = useState(false)
	
	const [changePassword, setChangePassword] = useState(false)


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

	const changePasswordHandler =  (e, val) => {
		setChangePassword(val)
		setResetPassSent(false)
	}

	const logoutHandler = async () => {
		await webAuth.logout({
		  returnTo: baseUrl+"/callback",
		  clientID: client
		});

		setToken(null)
	}

	return (
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
				role: {neonUser && neonUser.role} <br/>
				entity id: {neonUser && neonUser.entity_id} 
				</p>
				<button onClick={logoutHandler}>logout</button>
				<br/>
				<a href="#" onClick={e => changePasswordHandler(e, true)}>change password</a>
				<hr/>
				
			
			</div>
		}

		</div>

	)
}