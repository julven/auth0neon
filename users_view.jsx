const UsersView = () => {

	const {
		fetchData,
		getUserInfo,
		userInfo, setUserInfo
	}= useContext(AppContext)
	const {id} = useParams()
	const navigate = useNavigate()
	const [entityList, setEntityList] = useState([])

	const goBack = (e) => {
		e.preventDefault()
		navigate(-1)
	}

	const getUserEntities = async () => {
		setEntityList([])
		let sql = `
			SELECT * FROM users_entity_id_list WHERE user_id = '${userInfo.user_id}'

		`

		let resp = await fetchData(sql, "/neon-query")

		console.log({getUserEntities: {resp}})

		setEntityList( resp )
	}

	useEffect(() => {
		
		getUserInfo(id)
	}, [])

	useEffect(() => {
		// console.log({userInfo})
		if(userInfo.user_id) getUserEntities()
	}, [userInfo])

	return(
		<div>
			<p>users view</p>

			<p>
				email: {userInfo.email} <br/>
				first name: {userInfo.first_name} <br/>
				first name: {userInfo.last_name} <br/>
				role: {userInfo.role}<br/>
			</p>
			<p>entity id(s): {
				entityList.length > 0 ?
				entityList.map( x => x.entity_id).join(", ")
				:
				"all entities"
			}</p>
			
			<a href="#" onClick={goBack}>back</a>&nbsp;
			<Link to={`/users-edit/${id}`}>edit</Link>
		</div>
	)
}