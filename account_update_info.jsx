const AccountUpdateInfo = ({
	logoutHandler
}) => {

	const navigate = useNavigate()
	const { countries, getAllCountries,
		fetchData,
		neonUser,
	 } = useContext(AppContext)

	const [generalMessage, setGeneralMessage] = useState("")
	const [userLocal, setUserLocal] =useState({})
	const [error, setError] = useState(null)

	const userChangeHandler = (value, field) => {
		setUserLocal({
			...userLocal,
			[field] : value
		})
	}

	const submitHandler =async () => {
		console.log({submitHandler:{userLocal}})
		setGeneralMessage("")
		setError(null)

		if(userLocal.fname == "" || userLocal.agency_name == "") {
			setGeneralMessage("First name and company name must not be empty")
			setError(true)
			return
		}


		let sql = `
			UPDATE auth0_user SET
			first_name = '${userLocal.first_name}',
			last_name = '${userLocal.last_name}'
			WHERE user_id = '${userLocal.user_id}'
		`

		let sql2 = `
			UPDATE agency SET
			agency_name = '${userLocal.agency_name}',
			country = '${userLocal.country}'
			WHERE user_owner_id = '${userLocal.user_id}'
		`
		let resp = null
		try {
			resp = await Promise.all([
			fetchData(sql,"/neon-query"),
			fetchData(sql2,"/neon-query"),
		])
		} catch( err) {
			setGeneralMessage("Something went wrong, Pleast try again.")
			setError(true)
			return
		}
		

		console.log({submitHandler: {resp}})

		document.querySelector('#viewEl').scrollTo({ top: 0, behavior: 'smooth' });
		setGeneralMessage("Profile info updated.")
		setError(false)

		// resp.forEach( async (x, i) => {
		// 	resp[i] = await resp[i].json()
		// })

		// console.log({submitHandler: {resp}})
		return
	}




	useEffect(() => {
		console.log({AccountUpdateInfo: {neonUser}})
		if(countries.length == 0 ) getAllCountries()
	}, [])

	useEffect(() => {
		if(neonUser.user_id && !userLocal.user_id) setUserLocal({...neonUser})
	}, [neonUser])

	return (
		<div className="p-4 gap-3 d-flex flex-column">
			<div className="d-flex gap-2" >
				<div 
				onClick={() => {}}
				className="d-flex gap-2 justify-content-center" style={{width: 50,height: 50, borderRadius: 25, border: "1px solid lightgray", cursor: "pointer"}}>
					<img className="align-self-center" src="./src/back-arrow.png" style={{width: 15,height: 15,}}/>
				</div>
				<p className="align-self-center mb-1 fs-4">Update Profile</p>
			</div>

			<div className="container1 ">
				<div className="flex-column d-flex gap-4" style={{minHeight: 350}}>
					{generalMessage ? <p className={error ? 'text-danger':error == false ? 'text-success' : ''} >{generalMessage}</p> : null}
					<div className="container">
						<div className="row  mb-3">
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">EMAIL ADDRESS</p>
								<UiInput1 field="email" value={userLocal.email || ''} userChangeHandler={userChangeHandler} readOnly={true}/>
							</div>	
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">PHONE</p>
								<UiInput1 field="mobile" />
							</div>
						</div>

						<div className="row  mb-3">
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">FIRST NAME</p>
								<UiInput1 field="first_name" value={userLocal.first_name || ''} userChangeHandler={userChangeHandler}/>
							</div>
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">LAST NAME</p>
								<UiInput1 field="last_name" value={userLocal.last_name || ''} userChangeHandler={userChangeHandler}/>
							</div>
						</div>

						<div className="row  mb-3">
							<div className="col-md-12">
								<p className="poppins mb-1 fw-bold">COMPANY</p>
								<UiInput1 field="agency_name" value={userLocal.agency_name || ''} userChangeHandler={userChangeHandler}/>
							</div>
							
						</div>

						<div className="row  mb-3">
							<div className="col-md-12">
								<p className="poppins mb-1 fw-bold">ADDRESS 1</p>
								<UiInput1 field="location"/>
							</div>
							
						</div>

						<div className="row  mb-3">
							<div className="col-md-12">
								<p className="poppins mb-1 fw-bold">ADDRESS 2</p>
								<UiInput1 field="location"/>
							</div>
							
						</div>

						<div className="row  mb-3">
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">COUNTRY</p>
								<UiInput1 field="country" countries={countries} value={userLocal.country} userChangeHandler={userChangeHandler}/>
							</div>

							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">CITY</p>
								<UiInput1 field="location"/>
							</div>
							
						</div>


						<div className="row  mb-3">
							<div className="col-md-6">
								<p className="poppins mb-1 fw-bold">ZIP CODE</p>
								<UiInput1 field="zip" />
							</div>
							
						</div>

					</div>

					<div style={{maxWidth: 300}}>	
						<UiButton1 text="Update Profile" submit={submitHandler}/>
						<a href="#" onClick={logoutHandler}>logout</a>
					</div>
				</div>
			</div> 

		</div>
	)
}