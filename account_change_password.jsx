const AccountChangePassword = () => {

	const {neonUser,} = useContext(AppContext)
	const navigate = useNavigate()

	const [password, setPassword] = useState({
		current: "",
		new: "",
		confirm: ""
	})
	const [generalMessage, setGeneralMessage] = useState("")
	const [error, setError] = useState(null)
	const [proceed, setProceed] = useState(false)

	const userChangeHandler = ( value, field) => {

		setPassword({
			...password,
			[field]: value
		})

	}	

	const changePassword = async  () => {

		console.log({changePassword: {password}})

		setError(null)	
		setGeneralMessage("")
		setProceed(false)

		let valid = true
		Object.keys(password).forEach( (x, i) => {
			if([null, undefined, ""].includes(password[x])) {
				valid = false
			}
		})

		if(!valid) {
			setGeneralMessage("Fields must not be empty.")
			setError(true)
			return
		}


		if(password.new != password.confirm ) {
			setGeneralMessage("Confirm and New password did not match.")
			setError(true)
			return
		} 

		webAuth.login({
			
			username: neonUser.email,
			password: password.current,
			realm: 'Username-Password-Authentication',
			onRedirecting: function(done) {
				console.log(true);
				setProceed(true)
			}
		},
		function(err) {
			console.log({err})
		});


	}


	const proceedChangePassword = async () => {

		let resp = await fetch(`${apiUrl}/change-password`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				return myHeaders
			}) (),
			body: JSON.stringify({
				password: password.new,
				user_id: neonUser.user_id
			})
		})

		if(!resp.ok) {
			console.log({error: "error in proceed change password"})
			return
		}

		resp = await resp.json()

		console.log({proceedChangePassword: {resp}})

		// setGeneralMessage("password change success")
		// setError(false)

		if(!resp.user_id) {
			setGeneralMessage("error in proceed password reply from server")
			setError(false)
		}

		setGeneralMessage("Password change success")
		setError(false)
		setPassword({
			confirm: "",
			new: "",
			current: ""
		})
		return


	}

	useEffect(() => {
		if(proceed) {
			console.log("proceed change password")
			proceedChangePassword()
			setProceed(false)
		}
	}, [proceed])

	return(
		<div className="p-4 gap-3 d-flex flex-column">
			<div className="d-flex gap-2" >
				<div 
				onClick={() => navigate("/account")}
				className="d-flex gap-2 justify-content-center" style={{width: 50,height: 50, borderRadius: 25, border: "1px solid lightgray", cursor: "pointer"}}>
					<img className="align-self-center" src="./src/back-arrow.png" style={{width: 15,height: 15,}}/>
				</div>
				<p className="align-self-center mb-1 fs-4">Change Password</p>
			</div>

			<div className="container1 ">
				<div className="flex-column d-flex gap-4" style={{minHeight: 350}}>
					{generalMessage ? <p className={error ? 'text-danger':error == false ? 'text-success' : ''} >{generalMessage}</p> : null}
					<div>
						<p className="poppins mb-1 fw-bold">CURRENT PASSWORD</p>
						<UiInput2 type="password" field="current"  value={password.current} userChangeHandler={userChangeHandler}/>
					</div>

					<div>
						<p className="poppins mb-1 fw-bold">NEW PASSWORD</p>
						<UiInput2 type="password" field="new"  value={password.new} userChangeHandler={userChangeHandler}/>
					</div>

					<div>
						<p className="poppins mb-1 fw-bold">CONFIRM NEW PASSWORD</p>
						<UiInput2 type="password" field="confirm"  value={password.confirm} userChangeHandler={userChangeHandler}/>
					</div>
				</div>

				<UiButton1 text="Change Password" submit={changePassword} width={300}/>
				
			</div>

			
		</div>
	
	)
}