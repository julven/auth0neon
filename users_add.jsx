const UsersAdd = () => {

	const { ids, setIds, getIds, token } = useContext(AppContext)

	const [linker, setLinker] = useState(null)
	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [loading, setLoading] = useState(false)

	const addUser = async (data) => {


		// console.log({token})
		// return


	

		if(loading) return;
		setLoading(true)

		console.log("add user")

		setError("")
		setSuccess("")
		// setLinker(1)
		// childRef.current.resetForm()
		// return
		
		
		
		if(!("selectedRole" in data) || data.selectedRole == "") {
			setError("role required")
			setLoading(false)
			return
		}

		if(!("selectedId" in data) || data.selectedId == "") {
			setError("entity id required")
			setLoading(false)
			return
		}

		if(!("email" in data) || data.email == "") {
			setError("email required")
			setLoading(false)
			return
		}

		if(!("password" in data) || data.password.length <4) {
			setError("invalid password")
			setLoading(false)
			return
		}

		let resp = await getIds()

		console.log({id: data.selectedId, ids: resp, exists:resp.includes(Number(data.selectedId))})

		if(!resp.includes(Number(data.selectedId))) {
			setError("invalid entity id")
			setLoading(false)
			return;
		}


		// setLoading(false)
		// return
		

		let options = { 
			    connection: 'Username-Password-Authentication', 
			    email: data.email, 
			    password: data.password,
			 
			    user_metadata: { entity_id: data.selectedId, role: data.selectedRole, admin_creator: token.idTokenPayload.sub}
			  }

			  console.log({options})
		try {
			  webAuth.signup(options, function (err) { 
			  	setLoading(false)
			    if (err) {
			    	setError(err.code)
			    	console.log({addUser: {err}}); 
			    	return 
			    } 
			    setSuccess("user successfully created.")
			    setLinker(1)
			      return console.log('success signup without login!') 

			  });
		}
		catch (err) {
			console.log({addUser: {err}})
			setError(err)
			setLoading(false)
			return
		}

	}

	return(
		<div>
			<p>users add</p>
			{success !="" ? <p>{success}</p>: null}
			{error != "" ? <p>error: {error}</p>:null}
			<span><Link to="/users">back</Link></span>

			<UsersForm mode={"add"} submit={addUser	} linker={linker} setLinker={setLinker}/>
		</div>
	)
}