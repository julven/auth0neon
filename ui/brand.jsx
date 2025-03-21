const UiBrand = ({
	brandList
}) => {

	let navigate = useNavigate()
	let {id} = useParams()

	const { offCanvas, setPopupSidebarType, showCanvas, setShowCanvas,
	sidebarTitle, setSideBarTitle,
	editBrandId, setEditBrandId,
	 } = useContext(AppContext)

	const [test, setTest] = useState([1,2,3])
	const [displayList, setDislpayList] = useState([])
	const [search, setSearch] = useState("")


	



	const filterList = () => {
		let list = [...brandList]


		list = list.filter( x => x.brand.toLowerCase().includes(search.toLowerCase()))
		

		setDislpayList(list)
	}

	const toggleCanvas = () => {
		if(showCanvas) return offCanvas.show();
		offCanvas.hide()
		
	}

	const showCanvasHandler	 = (title, type, x) => {
		// console.log({showCanvasHandler: x})
		// return;
		setSideBarTitle(title)
		setPopupSidebarType(type)
		setShowCanvas(!showCanvas)
		if(x) navigate("/brand/id/"+x)
		

	}

	useEffect(() => {
		// console.log({displayList})
	}, [displayList])

	useEffect(() => {
		// console.log({brandList})
		setDislpayList([...brandList])
	}, [brandList])

	useEffect(() => {
		// console.log({search})
		filterList()
	},[search])

	useEffect( () => {
		if(offCanvas) toggleCanvas()
	}, [showCanvas])

	useEffect(() => {
		console.log({id})
		if(id) setEditBrandId(id)
	}, [id])


	return (
		<div className="p-4 d-flex flex-column gap-3">
			<div className="d-flex justify-content-between">

				<UiButton3 />
				<div className="d-flex gap-2">
					<UiInput3 value={search} setSearch={setSearch}/>
					<UiButton3 w={"130px"} text={"Brands"} left={true} logo={"./src/plus.png"} submit={() => showCanvasHandler("Add Brand","add_brand")}/>
				</div>
				
			</div>
			
			<div className="table-responsive">
				<table className="brand-table">
					<thead>	
						<tr>
							<th>Name</th>
							<th className="middle-row-th">Account Type</th>
							<th className="middle-row-th">Vendor Revenue Type</th>
							<th className="middle-row-th">Ads Management</th>
							<th className="middle-row-th">Start Date</th>
							<th className="middle-row-th">Status</th>
							<th className="middle-row-th">Action</th>
						</tr>

					</thead>
					<tbody>
					{displayList && displayList.map( x => (
						<tr key={x.id}>
							<td onClick={() => navigate("/brand/auth/"+x.brand_entity_id)} title={x.brand} style={{maxWidth:220,}} className="text-truncate">{x.brand}</td>
							<td onClick={() => navigate("/brand/auth/"+x.brand_entity_id)} className="middle-row-td">{x.account_type}</td>
							<td onClick={() => navigate("/brand/auth/"+x.brand_entity_id)} className="middle-row-td">{[undefined, false, null, "null",""].includes(x.vendor_revenue_type) ? "" : x.vendor_revenue_type}</td>
							<td onClick={() => navigate("/brand/auth/"+x.brand_entity_id)} className="middle-row-td">{x.ads_management ? x.ads_management.join("/") : ""}</td>
							<td onClick={() => navigate("/brand/auth/"+x.brand_entity_id)} className="middle-row-td">{moment(x.created).format("MMM, D YYYY")}</td>
							{x["active?"] ? <td className="text-success middle-row-td">Active</td>:<td className="middle-row-td text-danger">Inactive</td>}
							
							<td className="middle-row-td">
								<div className="d-flex gap-3 justify-content-center">
									<div 
									onClick={() => showCanvasHandler("Edit Brand", "edit_brand", x.id)}
									className="" style={{width: 20, height: 20, cursor: "pointer"}}>
										<img src="./src/edit.png" className="w-100"/>
									</div>

									<div className="" style={{width: 20, height: 20}}>
										
										{x['active?'] ?

										<img 
										onClick={() => showCanvasHandler("Deactivate this Account?", "off_brand", x.id)}
										src="./src/brand.png" className="w-100"/>
										:
										<img
										onClick={() => showCanvasHandler("Activate Account", "on_brand", x.id)}
										 src="./src/brand-on.png" className="w-100"/>
										}
									</div>
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