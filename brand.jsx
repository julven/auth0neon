const Brand = () => {

	const {
		fetchData,
		neonUser,
	}= useContext(AppContext)

	const [brandList, setBrandList] = useState([])

	const getBrands = async () => {


		let resp = await fetchData(`SELECT * FROM brand where user_id = '${neonUser.user_id}'`, "/neon-query")

		// console.log({getBrands: {resp}})

		setBrandList(resp)
	}

	useEffect(() => {
		if(neonUser.user_id) {
			getBrands()
		}
	},[neonUser])

	useEffect(() => {
		console.log({brandList})
	}, [brandList])


	return(
		<div >	
			<p>brand</p>

			<p><Link to="/brand-add">add brand</Link></p>
			{brandList.length > 0 ?
			<div >
			
				<table className="entity-table">	
					<thead>
						
						<tr>
							{Object.keys(brandList[0]).map( (x, i) => (
							<th key={i}>{x}</th>
							))
							}
						</tr>
					</thead>
					<tbody>
						{brandList.map( (x, i) => (
							<tr key={i}>
							{Object.keys(x).map( (xx, ii) => (
								<td key={ii}>
								{xx == 'active?' ? 
								x['active?'] ? "YES": "NO" 
								: 
								xx == 'ads_management' ? x['ads_management'] && x['ads_management'].join(", "): x[xx]}
								</td>
							))
							}
								<td>
									<div>
										<span><Link to={`/brand-edit/${x['id']}`}>edit</Link>&nbsp;</span>
										<span><Link to={`/brand-auth/${x['brand_entity_id']}`}>authorizations</Link>&nbsp;</span>
									</div>
								</td>
							</tr>
						))
						}
					</tbody>
				</table>
			</div>
			:
			<div>

			</div>

			}
			

		</div>

	)
}