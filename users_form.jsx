const UsersForm = ({mode, submit, linker, setLinker}) => {

	const { fetchData, ids, authUser } = useContext(AppContext)

	const [roles, setRoles] = useState([])
	const [selectedRole, setSelectedRole] = useState("")
	const [selectedId, setSelectedId] = useState("")
	const [user, setUser] = useState({
		email: "",
		password: "",
	})

	
	const resetForm = () => {
			setUser({
				email:"", password: "",
			})
			setSelectedId("")
			setSelectedRole("")
		}

	const roleChangeHandler = (value) => {
		setSelectedRole(value)
	}


	const getRoles = async () => {

		let resp = await fetchData("SELECT unnest(enum_range(NULL::roles))", "/neon-query")

		
		resp = resp.map( x=> x.unnest)

		console.log({getRoles: {resp}})

		setRoles(resp)
	}

	const selectIdHandler = (value) => {

		setSelectedId(value)
	}

	const userChangeHandler = (value, field) => {

		setUser({
			...user,
			[field] : value
		})

	}

	const submitHandler = () => {
		submit({
			...{...user,...{
				selectedId,
				selectedRole,
			},},
			...{authUser},
			
		})
	}

	useEffect(() => {
		getRoles()
		console.log({mode})
	}, [])

	useEffect(() => {
		console.log({user})
	}, [user])

	useEffect(() => {
		console.log({linker})
		if(linker != null) {
			setLinker(null)
			resetForm()
		}
	}, [linker])

	return(
		<div>
			<p>
				role: 
				<select onChange={e => roleChangeHandler(e.target.value)}>
					<option value="">-select-</option>
					{roles.map( x => (

					<option key={x} value={x}>{x}</option>

					))

					}
				</select>
			</p>
			<p>
				entity id <input type="number" value={selectedId} onChange={e => selectIdHandler(e.target.value)}/>
			</p>

			<p>
				email <input type="email" value={user.email} onChange={e => userChangeHandler(e.target.value, "email")}/>
			</p>
			<p>
				password <input type="text" value={user.password} onChange={e => userChangeHandler(e.target.value, "password")}/>
			</p>

			<button onClick={() => submitHandler()}>submit</button>
		</div>
	)
}

	