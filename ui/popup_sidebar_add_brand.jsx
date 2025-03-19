const UiPopupSidebarAddBrand = ({
	
	generalMessage,
	goBack,
	brandName,
	errorList,
	setSelectedSatus,
	accountTypeList,
	setSelectedAccountType,
	adsManagementChangeHandler,
	setVendorRevenueType,
	selectedAccountType,
	createBrand,
	setBrandName,

}) => {

	const setBrandNameHandler = (value) => {
		setBrandName(value)
	}



	return (
		<div className="d-flex flex-column justify-content-between h-100" >

			<div className="d-flex flex-column gap-4">
				<div className="d-flex flex-column gap-2">
					{generalMessage && <p className={errorList.length > 0 ? "poppins text-danger":"poppins text-success"}>{generalMessage}</p>}
					<p className="mb-0 fw-bold poppins">Brand Name</p>
					<UiInput1 value={brandName} userChangeHandler={setBrandNameHandler}/>
				</div>

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">ACCOUNT TYPE</p>
					<div className="d-flex gap-3">
						{/*<input  type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => {}}/> <span>Shipped COGs </span>*/}
						{accountTypeList.map( x => (
						<div key={x} className="d-flex gap-3">
						
							<input key={x} type="radio" name="account_type" className="input-radio align-self-center" onChange={e => {setSelectedAccountType(x)}}/> <span className="poppins align-self-center">{x}</span>
								
						
						</div>
						))
						}
					</div>
				</div>

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">ADS MANAGEMENT</p>
					<div className="d-flex gap-3">
						<input  type="checkbox" name="ads_management" className="input-radio align-self-center" onChange={e => {adsManagementChangeHandler("ppc")}}/> <span  className="poppins align-self-center">PPC</span>
					
						<input  type="checkbox" name="ads_management" className="input-radio align-self-center" onChange={e => {adsManagementChangeHandler("dsp")}}/> <span  className="poppins align-self-center">DSP</span>
					</div>
				</div>
				{selectedAccountType == "vendor" &&
					<div className="d-flex flex-column gap-2">
						<p className="mb-0 fw-bold poppins">ORDER REVENUE TYPE</p>
						<div className="d-flex gap-3">
							<input  type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => {setVendorRevenueType("shipped cogs")}}/> <span  className="poppins align-self-center">Shipped COGs </span>
						
							<input  type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => {setVendorRevenueType("ordered revenue")}}/> <span  className="poppins align-self-center">Ordered Revenue</span>
						</div>
					</div>
				}

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">BRAND STATUS</p>
					<div className="d-flex gap-3">
						<input  type="radio" name="status" className="input-radio align-self-center" onChange={e => {setSelectedSatus(true)}}/> <span  className="poppins align-self-center">Active </span>
					
						<input  type="radio" name="status" className="input-radio align-self-center" onChange={e => {setSelectedSatus(false)}}/> <span  className="poppins align-self-center">Inactive</span>
					</div>
				</div>

			</div>

			<UiButton1 text="Save" submit={createBrand}/>
		</div>
	)
}