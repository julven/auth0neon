const UiPopupSidebar = () => {

	const { popupSidebarType, setPopupSidebarType, setShowCanvas,
	sidebarTitle, setSideBarTitle
	  } = useContext(AppContext)

	const closeSidebar = () => {
		setPopupSidebarType("")
		setShowCanvas()
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
			  null
			  }
			  	
			  </div>
			</div>

		</div>
	)
}