const UiPopupSidebar = () => {

	const { 
		popupSidebarType,
		setPopupSidebarType, 
		setShowCanvas,
		sidebarTitle, 
		setSideBarTitle,
		fetchData,
		editBrandId,
		getBrands,
	  } = useContext(AppContext)

	const [loading, setLoading] = useState(false)

	const closeSidebar = () => {
		setPopupSidebarType("")
		setShowCanvas()
	}

	const brandStatusChangeHandler = async (active) => {

		setLoading(true)

		let sql = `
			UPDATE brand set "active?" = ${active} WHERE brand.id = ${editBrandId}

		`
		console.log({brandStatusChangeHandler: {editBrandId, active, sql}})
		let resp = null
		try {
			resp = await fetchData(sql, "/neon-query")

		}
		catch( err ) {
			console.log({ERROR: "err"})
			setLoading(false)
			return
		}

		// if(!resp.ok) {
		// 	console.log({ERROR: "error in brand status change handler"})
		// 	return
		// }

		await getBrands()
		closeSidebar()
		setLoading(false)

	}



	return (
		<div>
			<div style={{minWidth: 500}} className="offcanvas offcanvas-end p-4" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
			  <div className="offcanvas-header p-0 mb-3">
			    <h5 className="offcanvas-title fs-3" id="offcanvasRightLabel">{sidebarTitle || "Sidebar"}</h5>
			    <button onClick={closeSidebar} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			  </div>
			  <div style={{height: 2}} className="gradiant-h mb-4"></div>
			  <div className="offcanvas-body p-0" >
			  {popupSidebarType == 'add_brand' ?
			  <BrandAdd />
			  :
			  popupSidebarType == 'edit_brand' ?
			  <BrandEdit />
			  :
			   popupSidebarType == 'off_brand' ?
			   
			   <div className="h-100" style={{overflow: "hidden"}}>
				{!loading ?
				<div className="h-100 d-flex flex-column justify-content-between">
					<div>
						<p className="poppins">Are you sure you want to deactivate this account?</p>
					</div>

					<UiButton1 text="Deactivate" submit={() => brandStatusChangeHandler(false)}/>
				</div>
				: <p className="poppins">loading...</p>
				}
				</div>
			   		

			
			  :
			   popupSidebarType == 'on_brand' ?
			  <div className="h-100" style={{overflow: "hidden"}}>
			   {!loading ? 
				<div className="h-100 d-flex flex-column justify-content-between">
					<div>
						<p className="poppins">Activate this Account?</p>
					</div>

					<UiButton1 text="Activate" submit={() => brandStatusChangeHandler(true)}/>

				</div>
			   : <p className="poppins">loading...</p>

				}
			   	</div>
			  
			   :
			  null
			  }
			  	
			  </div>
			</div>

		</div>
	)
}