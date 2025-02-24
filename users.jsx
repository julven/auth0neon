const Users = () => {

	const { fetchData, token, getKeys } = useContext(AppContext)
	const [userList, setUserList] = useState([])


	const getUserList = async () => {

		console.log({getUserList: {token}})

		let resp = await fetchData(`SELECT * FROM auth0_user WHERE admin_creator = '${token.idTokenPayload.sub}'`,"/neon-query")

		console.log({getUserList: {resp}})

		setUserList(resp)
		return
	}

	useEffect(() => {
		getUserList()
	}, [])

	useEffect(() => {
		console.log({userList})
	}, [userList])

	return(
		<div >
			<p>users</p>
			<span><Link to="/users-add">add user</Link></span>

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

								<td key={`${x}_${xx}`}>{x[xx]}</td>
							))

							}

							
						</tr>
					))

					}
					</tbody>

				</table>
			</div>
		</div>
	)
}