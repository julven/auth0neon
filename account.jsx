const Account = () => {

	const {
		authUser, setAuthUser,
		neonUser, token,
		getNeonUser,
		fetchData 
	} = useContext(AppContext)

	const [resetPassSent, setResetPassSent] = useState(false)
	
	const [changePassword, setChangePassword] = useState(false)

	const [loaded, setLoaded] = useState(false)

	const [agencyName, setAgencyName] = useState("")

	const [error, setError] = useState("")

	const [edits, setEdits] = useState("")

	const [name, setName] = useState({
		fname: "",
		lname: ""
	})

	const nameChangeHandler = (value, field) => {
		setName({
			...name,
			[field] : value
		})
	}

	const editsHandler = (e, value) => {
		e.preventDefault()
		
		if(value == "") {
			setName({
				fname: "",
				lname: ""
			})
			
		}

		setEdits(value)
	}

	const agencyNameSubmitHandler = async (field) => {
		if((field== "fname" && name.fname == "") || (field== "lname" && name.lname == "")) {
			setError("first name and last name must not be empty")
			return
		}



		let addQuery = field == 'fname' ? `SET first_name = '${name.fname}'` : field == 'lname' ? `SET last_name = '${name.lname}'` : null

		let resp = await fetchData(`UPDATE auth0_user ${addQuery} WHERE user_id = '${token.idTokenPayload.sub}'`, "/neon-query")
		
		console.log({agencyNameSubmitHandler: {resp}})

		getNeonUser()

		setEdits("")
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

	const createBrand = async () => {
		setError("")

		if(agencyName == "") {
			setError("invalid brand name")
			return
		}

		// console.log({createBrand: {agencyName, id: token.idTokenPayload.sub}})
		// return

		let resp = await fetchData(`INSERT INTO agency (agency_name, user_owner_id) VALUES ('${agencyName}','${token.idTokenPayload.sub}')`,"/neon-query")

		console.log({createBrand: {resp}})

		getNeonUser()
	}

	const changePasswordHandler =  (e, val) => {
		e.preventDefault()
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

	useEffect(() => {

		if(neonUser.user_id) {
			setLoaded(true)


		} 
	}, [neonUser])

	useEffect(() => {
		if(edits == 'fname') {
			setName({
				...name, fname: neonUser.first_name || ""
			})
		}
		if(edits == 'lname') {
				setName({
				...name, lname: neonUser.last_name|| ""
			})
		}
	}, [edits])

	if(ui) return <AccountUpdateInfo 
		logoutHandler={logoutHandler}
		/>

	else return (
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
				{error ? <><br/>error: {error}</> : null}
				<p>
				email: {authUser.email} <br/>
				user id: {authUser.user_id} <br/>
				name: {authUser.nickname} <br/>
				email verfied: {authUser.email_verified ? 'yes' : 'no'} <br/>
				role: {neonUser && neonUser.role} <br/>
				{edits == 'fname' ? 
				<>
				first name: <input value={name.fname} onChange={e => nameChangeHandler(e.target.value, "fname")} /> &nbsp;
				<button onClick={() => agencyNameSubmitHandler('fname')}>submit</button> &nbsp; 
				<a href="#" onClick={e=>editsHandler(e,"")}>cancel</a>
				<br/>
				</>
				:
				<>
				first name: {neonUser.first_name} &nbsp;
				<a href="#" onClick={e=>editsHandler(e,"fname")}>edit</a>
				<br/>
				</> 
				}

				{edits == 'lname' ? 
				<>
				last name: <input value={name.lname} onChange={e => nameChangeHandler(e.target.value, "lname")} /> &nbsp;
				<button onClick={() => agencyNameSubmitHandler('lname')}>submit</button> &nbsp; 
				<a href="#" onClick={e=>editsHandler(e,"")}>cancel</a>
				<br/>
				</>
				:
				<>
				last name: {neonUser.last_name} &nbsp;
				<a href="#" onClick={e=>editsHandler(e,"lname")}>edit</a>
				<br/>
				</> 
				}

				{neonUser.agency_name ? 
				<>
				agency: {neonUser.agency_name} <br/>
				agency id: {neonUser.agency_id} <br/>
				</>
				:
				neonUser.role == 'owner' && loaded ?
				<>
				create agency: 
				<input value={agencyName} type="text" onChange={e => setAgencyName(e.target.value)}/> 
				&nbsp;
				<button onClick={createBrand}>create</button>
				</>
				: 
				null
				}
				
				</p>
				
				<br/>
				<a href="#" onClick={e => changePasswordHandler(e, true)}>change password</a>
				<hr/>
				
				<button onClick={logoutHandler}>logout</button>
			</div>
		}

		</div>

	)
}