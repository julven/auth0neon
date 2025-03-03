const Users = () => {

	const { fetchData, token, getKeys } = useContext(AppContext)
	const [userList, setUserList] = useState([])
	const [entityList, setEntityList] = useState([])

	const getUserList = async () => {

		// console.log({getUserList: {token}})

		let resp = await fetchData(`SELECT * FROM auth0_user WHERE admin_creator = '${token.idTokenPayload.sub}'`,"/neon-query")

		// console.log({getUserList: {resp}})
		resp = resp.map( (x, i) => {
			delete x['entity_id']
			delete x['email_verified']
			return{
				...x,
				entities: entityList.filter( xx => xx.user_id == x.user_id).map(xx => xx.entity_id).join(", ")
			}
		})
		setUserList(resp)
		return
	}



	const getUserEntities = async () => {
		let sql = `
			SELECT * FROM users_entity_id_list 

		`

		let resp = await fetchData(sql, "/neon-query")

		console.log({getUserEntities: {resp}})

		setEntityList( resp )
	}

	const setActiveStatus = async (e,user_id, value) => {
		e.preventDefault()

		let conf = null
		let sql = `
			UPDATE auth0_user SET "active?" = ${value} WHERE user_id = '${user_id}'
		`

		if(value == false) conf = confirm("revoke access for this user?")
		if(value == true) {
			let resp = await fetchData(sql, "/neon-query")
			getUserList()
			return 
		}

		if(conf) {
			let resp = await fetchData(sql, "/neon-query")
			getUserList()
			return 
		}
	}

	useEffect(() => {
		getUserEntities()
	
	}, [])

	useEffect(() => {
		console.log({entityList})
		if(entityList.length > 0) getUserList()
	}, [entityList])

	return(
		<div >
			<p>users</p>
			<p><Link to="/users-add">add user</Link></p>
		
			<div style={{maxWidth: '100%', overflowX: "scroll"}}>
				<table className="entity-table">
					<thead>
						<tr>
						{userList.length > 0 && getKeys(userList[0]).map( x => (
							<th key={x}>{x}</th>

						))

						}
						</tr>
					</thead>
					<tbody>
					{userList.map( (x, i) => (
						<tr key={`${x}_${i}`}>
							{getKeys(x).map( xx => (

								<td key={`${x}_${xx}`}>
								
									{xx == "active?" ? 
									<span>
										{x['active?'] ? "YES": "NO"}
									</span>
									:
									<span>
									{x[xx]}
									</span>

									}
								</td>
							))

							}
							<td>
								<div>
									
									{x['active?'] ?	

									<span>
										<Link to={`/users-view/`+x.id}>view</Link>&nbsp;
										<a href="#" onClick={e => setActiveStatus(e, x.user_id, false)}>revoke</a>&nbsp;
									</span>
									:
									<span>
										<a href="#" onClick={e => setActiveStatus(e, x.user_id, true)}>allow</a>&nbsp;
										{/*<a href="#">delete</a>&nbsp;*/}
									</span>
									}
									
									
								</div>
								
							</td>
							
						</tr>
					))

					}
					</tbody>

				</table>
			</div>
		</div>
	)
}