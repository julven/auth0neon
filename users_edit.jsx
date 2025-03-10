const UsersEdit = () => {

	const { id } = useParams()
	const navigate = useNavigate()


	const {
		fetchData,
		getUserInfo,
		userInfo, setUserInfo,
		neonUser,
		agencyList, setAgencyList,
		ids,
		filterIds,
		getRoles,
		roles, setRoles
	} = useContext(AppContext)


	// const [roles, setRoles] = useState([])
	const [ user, setUser] = useState({})
	const [userEntities, setUserEntities] = useState([])
	const [editUserEntities, setEditUserEntities] = useState(false)
	const [ selectedEntity, setSelectedEntity] = useState("")
	const [selectedRemoveEntities, setSelectedRemoveEntities] = useState([])
	const [ generalMessage, setGeneralMessage] = useState("")

	// const getRoles = async () => {

	// 	let resp = await fetchData("SELECT unnest(enum_range(NULL::roles))", "/neon-query")

		
	// 	resp = resp.map( x=> x.unnest)
	// 	console.log({getRoles: {resp}})

	// 	setRoles(resp.filter( x=> !['admin','owner'].includes(x)))
	// 	return
	// }

	const getUserEntities = async () => {
		let sql = `
			SELECT * FROM users_entity_id_list WHERE user_id = '${user.user_id}'

		`

		let resp = await fetchData(sql, "/neon-query")

		console.log({getUserEntities: {resp}})

		setUserEntities(resp)
		return
	}

	const addUserEntity = async () => {
		setGeneralMessage("")
		if(selectedEntity == "") {
			setGeneralMessage(`no selected entity value.`)
			return	
		}
		let sql = `
			INSERT INTO users_entity_id_list (user_id, entity_id)
			VALUES
			('${user.user_id}',${selectedEntity})	
		`

		let resp = await fetchData(sql, "/neon-query")

		console.log({addUserEntity: {resp}})

		await getUserEntities()
	
		setSelectedEntity("")
		setGeneralMessage(`successfully added new entity value(s).`)
		return 
	}


	const userChangeHandler = (value, field) => {
		setUser({
			...user,
			[field] : value
		})
	}


	const removeUserEntities = async () => {
		setGeneralMessage("")
		if(selectedRemoveEntities.length == 0) {
			setGeneralMessage(`no value(s) selected.`)
			return;
		} 

		let sql = `

			DELETE 
			FROM users_entity_id_list 
			WHERE user_id = '${user.user_id}' 
			AND entity_id IN (${selectedRemoveEntities.map( x => x.entity_id).join(",")})
		`

		

		let resp = await fetchData(sql, "/neon-query")

		console.log({removeUserEntities: {resp}})

		getUserEntities()
		setSelectedRemoveEntities([])
		setEditUserEntities(false)
		setGeneralMessage(`successfully removed field value(s) '${selectedRemoveEntities.map( x => x.entity_id).join(",")}'`)

		return
	}

	const updateUserInfo = async (field) => {
		setGeneralMessage("")
		if(user[field] == "") {
			setGeneralMessage(`this field '${field}' must not be empty`)
			return;	
		}

		let sql = `
			UPDATE auth0_user SET ${field} = '${user[field]}' WHERE user_id = '${user.user_id}'
		`

		console.log({updateUserInfo: {sql, field, value: user[field]}})

		let resp = await fetchData(sql, "/neon-query")

		setGeneralMessage(`successfully updated '${field}' field.`)

		return
	}

	const goBack = (e) => {
		e.preventDefault()
		navigate(-1)
	}


	useEffect(() => {
		if(roles.length == 0) getRoles();
		if(!("id" in userInfo)) getUserInfo(id) 
		
	},[])

	useEffect(() => {
		if(neonUser.agency_id) filterIds()
		
	}, [ neonUser, userInfo])

	useEffect(() => {
		if(("id" in userInfo) && roles.length > 0) {
			setUser({...userInfo})
		}
	}, [userInfo, roles])

	useEffect(() => {
		console.log({user})
		if(user.user_id) getUserEntities()
	}, [user,])

	useEffect(() => {
		console.log({ids})
	}, [ids])

	return(
		<div>
			<p>
			users edit <br/>
			<a href="#" onClick={goBack}>back</a>
			</p>
			
			{generalMessage && <p>{generalMessage}</p>}
	
			<p>email: <input readOnly type="email" value={user.email || ""} onChange={e => userChangeHandler(e.target.value, "email")}/> 
			
			</p>
			<p>first name: <input type="text" value={user.first_name || ""} onChange={e => userChangeHandler(e.target.value, "first_name")}/> 
			&nbsp;<button onClick={() => updateUserInfo('first_name')}>update</button>
			</p>
			<p>first name: <input type="text" value={user.last_name || ""} onChange={e => userChangeHandler(e.target.value, "last_name")}/>  
			&nbsp;<button onClick={() => updateUserInfo('last_name')}>update</button>
			</p>
			
			<p>role: 
			<span>
				<select value={user.role || ""} onChange={e => userChangeHandler(e.target.value, "role")}>
					<option value="">-select-</option>
					{roles.map( x => (
					<option key={x} value={x}>{x}</option>
					))}
				</select>
				&nbsp;<button onClick={() => updateUserInfo('role')}>update</button>
			</span></p>
			Only access these brands: &nbsp;
			{editUserEntities ?
			<div>
				{userEntities.map( x => (
					<span key={x.id}>
						<input type="checkbox" name="user-entities" onChange={() => setSelectedRemoveEntities([...selectedRemoveEntities,x])}/>&nbsp;{x.entity_id}
					</span>
				))}
				<br/>
				&nbsp;<button onClick={removeUserEntities}>remove</button>
				&nbsp;<button onClick={() => setEditUserEntities(false)}>cancel</button>
			</div>
			:
			<span>
			{userEntities.length > 0 ? 
			userEntities.map( x => x.entity_id).join(", ")
			:
			"all entities"
			}
			&nbsp;<button hidden={userEntities.length == 0 } onClick={() => setEditUserEntities(true)}>edit</button>
			</span>
			}
			
			
			
			<br/><br/>
			<select value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)}>
				<option value="">-select-</option>
				{ids.filter( x => !userEntities.map(x => x.entity_id).includes(x)).map( x => (
				<option key={x} value={x}>{x}</option>
				))}
			</select>
			<button onClick={addUserEntity}>add</button>
			


			
			
		</div>
	)
}