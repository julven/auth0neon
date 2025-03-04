const NeonPage = () => {

	const {
	 selectedId, 
	 setSelectedId, 
	fetchData,
	 getKeys,
	 list,setList, 
	 getIds, 
	 ids, 
	 setIds, 
	neonUser, 
	marketplaceList, 
	getMarketPlace,
	setMarketplaceList,
	filterIds,
	getList,
	getRoleView,
	agencyList, setAgencyList
} = useContext(AppContext)

	const {id} = useParams()
	const navigate = useNavigate()

	

	
	const [loading, setLoading] = useState(false)

	// const [agencyList, setAgencyList] = useState([])




	const getAgencyList = async () => {

		let resp  = await fetchData("SELECT * FROM client_agency_info", "/neon-market")

		console.log({getAgencyList: {resp}})

		setAgencyList(resp)

		return

	}

	const getAgencyName = (id) => {
		return agencyList.filter( x => x.id == id)[0].agency_name
	}

	const getMarketPlaceCountry = (id) => {

		// return marketplaceList.filter( x => x.marketplaceid == id)[0].country
		return id
	}




	useEffect(() => {

		console.log("neon-query")

		;(async () => {
			setLoading(true)
			// await getIds();
			await getMarketPlace()
			await getAgencyList()
			// getList()
			
			setLoading(false)
		})()
		

		
	}, [])



	useEffect(() => {
		console.log({id, neonUser, ids, exists: ids.includes(Number(id))})
		 if(ids.length > 0 && id && neonUser.role && ids.includes(Number(id))) {
		 	getList(id);
		 	
		 } 
		
	}, [id, neonUser, ids])

	useEffect(() => {
		// console.log({neonUser})
		// if(neonUser.role == "normal") {
			
		// 	navigate(`/${neonUser.entity_id}`)

		// }
		// if(["owner","editor"].includes(neonUser.role) ) {
		// 	// console.log("neon user info")
		// 	filterIds()
		// }
		if(neonUser.role ) filterIds()
	}, [neonUser])
	

	useEffect(() => {

	},[neonUser])



	

	return (
		<div>
			
			{neonUser.user_id ?
			<div>
				<p>list of entity id</p>
				<div style={{maxWidth: '100%', overflowX: "scroll"}}>
					{ids.map( x => (
					<span key={x}>
						<Link to={`/${x}`}>{x}</Link>&nbsp;
					</span>
					
					))

					}
				</div>
			</div>
			
			:
			null

			}
			
			{list.length > 0?
			<div>
				<p>
				entity id: {selectedId} <br/>

				client info id: {list[0].client_info_id || 'n/a'}<br/>
				company name: {list[0].company_name} <br/>
				agency name: { agencyList.length > 0 && getAgencyName(list[0].agency_id)} <br/>
				
				</p>
				<div style={{maxWidth: '100%', overflowX: "scroll"}}>
					<table className="entity-table">	
						<thead>
							<tr>
								{getKeys(list[0]).map( xx => (
								<th key={xx}>
									{xx}
								</th>
								))

								}
							</tr>
						</thead>
						<tbody>
							{list.map( (x, i) => (
							<tr key={`${x}-${i}`}>
								{getKeys(x).map( (xx, ii) => (
								<td key={`${ii}-${xx}`}>
									{
									xx == 'agency_id' ? 
									`${agencyList.length > 0  && getAgencyName(x[xx])}`
									: 
									x[xx]
									}
								</td>
								))

								}

							</tr>

							))

							}
						</tbody>
					</table>
				</div>

				<BigQuery />	


			</div>

			:
			null
			}

		
		</div>

	)
}