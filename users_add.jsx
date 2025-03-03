const UsersAdd = () => {

	const navigate = useNavigate()

	const { 
		fetchData, 
		filterIds,
		ids,
		neonUser,
		getRoles,
		roles, setRoles,
		userInfo,
	} = useContext(AppContext)

	const [user, setUser] = useState({
		email: "",
		fname: "",
		lname: "",
		role: "",
		entities: [],
		password: ""
	})
	const [selectedEntity, setSelectedEntity] = useState("")
	const [removeSelectedEntities, setRemoveSelectedEntities] = useState([])
	const [errorList, setErrorList] = useState([])
	const [generalMessage, setGeneralMessage] = useState("")
	const [userRegistered, setUserRegistered] = useState(false)


	const userChangeHandler = (value, field) => {
		setUser({
			...user,
			[field] : value
		})
	}

	const addUserEntity = () => {
		console.log({addUserEntity:{selectedEntity}})

		let list = [...user.entities]

		list.push(selectedEntity)

		setUser({...user, entities: list})
	}

	const removeSelectedEntitiesHandler = () => {
		console.log({removeSelectedEntitiesHandler: {removeSelectedEntities}})

		let list = user.entities.filter( x => !removeSelectedEntities.includes(x))

		setUser({...user, entities: list})
	}

	const registerUserHandler = () => {
		// console.log({registerUserHandler:  {user}})
		// return
		
		setGeneralMessage("")
		setErrorList([])

		let valid = true, errors = []
		Object.keys(user).forEach( x => {
			if(x == 'entities') return
			if(user[x] == "") {
				console.log({[x] : user[x]})
				valid = false
				errors.push(x)
			}
		})
		if(user.entities.length == 0) {
			errors.push('entities')
			valid = false
		}
		setErrorList(errors)
		if(!valid) {
			setGeneralMessage("required fields must not be empty.")
			 return
		}

		let meta = {
			fname: user.fname,
			lname: user.lname,
			role: user.role,
			entities: JSON.stringify(user.entities.map(x => Number(x))),
			admin_creator: neonUser.user_id
		}

		console.log({registerUserHandler: {meta}})
		// return 

		webAuth.signup({
			connection: "Username-Password-Authentication",
			email: user.email,
			password: user.password,
			user_metadata: meta
		}, function (err) {
			
			if(err) {
				console.log({registerUserHandler: {err}})
				setGeneralMessage(err.description)
				return 

			} 

			setUserRegistered(true)
			setGeneralMessage("user successfully registered.")
			setUser({
				email: "",
				fname: "",
				lname: "",
				role: "",
				entities: [],
				password: ""
			})
			
		})
	}

	const goBack = (e) => {
		e.preventDefault()
		navigate(-1)
	}

	useEffect(() => {
		if(roles.length == 0) getRoles()
	},[])

	useEffect(() => {	
		if(ids.length== 0 && ("agency_id" in neonUser)) filterIds()
		console.log({ids, neonUser})
	}, [ids, neonUser])

	
	useEffect(() => {
		console.log({user})
	}, [user])

	return(
		<div>
			<p>add user</p>
			{generalMessage && <p>{generalMessage}</p>}

			<p>email: <input type="email" value={user.email} onChange={e => userChangeHandler(e.target.value,"email")}/></p>
			<p>password: <input type="text" value={user.password} onChange={e => userChangeHandler(e.target.value,"password")}/></p>
			<p>first name: <input type="email" value={user.fname} onChange={e => userChangeHandler(e.target.value,"fname")}/></p>
			<p>last name: <input type="email" value={user.lname} onChange={e => userChangeHandler(e.target.value,"lname")}/></p>
			<p>role: 
			<span>
				<select value={user.role || ""} onChange={e => userChangeHandler(e.target.value, "role")}>
					<option value="">-select-</option>
					{roles.map( x => (
					<option key={x} value={x}>{x}</option>
					))}
				</select>
			</span>
			</p>

			<div>
			entity id(s): &nbsp;
				{user.entities.map( x => (
					<span key={x}>
						<input type="checkbox" name="user-entities" onChange={() =>setRemoveSelectedEntities([...removeSelectedEntities, x])}/>&nbsp;{x}
					</span>
				))}
				<br/>
				&nbsp;<button hidden={user.entities.length == 0} onClick={removeSelectedEntitiesHandler}>remove</button>
				
			</div>
			<br/>
			<select value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)}>
				<option value="">-select-</option>
				{ids.filter( x => !user.entities.map(x => Number(x)).includes(x)).map( x => (
				<option key={x} value={x}>{x}</option>
				))}
			</select>
			<button onClick={addUserEntity}>add</button>
			
			<br/>
			<p>
			<button onClick={registerUserHandler}>submit</button>
			&nbsp;<a href="#" onClick={goBack}>back</a>
			</p>
		</div>

	)
}