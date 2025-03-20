const UiPopupSidebarEditBrand = ({
	
	goBack,
	generalMessage,
	brandEntityId,
	setBrandEntityId,
	updateEntityId,
	brand,
	errorList,
	brandChangeHandler,
	accountTypeList,
	adsManagementChangeHandler,
	setBrand,
	updateBrand,


}) => {

	
	if(!brand.id) return (<>loading...</>)

	return (
		<div className="d-flex flex-column justify-content-between h-100" >

			<div className="d-flex flex-column gap-4">
				<div className="d-flex flex-column gap-2">
					{generalMessage && <p className={errorList.length > 0 ? "poppins text-danger":"poppins text-success"}>{generalMessage}</p>}
					<p className="mb-0 fw-bold poppins">Brand Name</p>
					<UiInput1 value={brand.brand || ""} field={"brand"} userChangeHandler={brandChangeHandler}/>
				</div>

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">ACCOUNT TYPE</p>
					<div className="d-flex gap-3">
						{/*<input  type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => {}}/> <span>Shipped COGs </span>*/}
						{accountTypeList.map( x => (
						<div key={x} className="d-flex gap-3">
						
							<input 
							checked={brand.account_type == x || false}
							type="radio" name="account_type" className="input-radio align-self-center" onChange={e =>  brandChangeHandler(x, 'account_type')}/> <span className="poppins align-self-center">{x}</span>
								
						
						</div>
						))
						}
					</div>
				</div>

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">ADS MANAGEMENT</p>
					<div className="d-flex gap-3">
						<input  
						checked={(brand.ads_management|| []).includes('ppc')}
						type="checkbox" name="ads_management" className="input-radio align-self-center" onChange={e => adsManagementChangeHandler("ppc")}/> <span  className="poppins align-self-center">PPC</span>
					
						<input  
						checked={(brand.ads_management|| []).includes('dsp')}
						type="checkbox" name="ads_management" className="input-radio align-self-center" onChange={e => adsManagementChangeHandler("dsp")}/> <span  className="poppins align-self-center">DSP</span>
					</div>
				</div>
				{brand.account_type == "vendor" &&
					<div className="d-flex flex-column gap-2">
						<p className="mb-0 fw-bold poppins">ORDER REVENUE TYPE</p>
						<div className="d-flex gap-3">
							<input  
							checked={brand.vendor_revenue_type == 'shipped cogs'}
							type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => setBrand({...brand, vendor_revenue_type: "shipped cogs"})}/> <span  className="poppins align-self-center">Shipped COGs </span>
						
							<input  
							checked={brand.vendor_revenue_type == 'ordered revenue'}
							type="radio" name="vendor_revenue_type" className="input-radio align-self-center" onChange={e => setBrand({...brand, vendor_revenue_type: "ordered revenue"})}/> <span  className="poppins align-self-center">Ordered Revenue</span>
						</div>
					</div>
				}

				<div className="d-flex flex-column gap-2">
					<p className="mb-0 fw-bold poppins">BRAND STATUS</p>
					<div className="d-flex gap-3">
						<input 
						checked={brand['active?'] || false}
						type="radio" name="status" className="input-radio align-self-center" onChange={e => brandChangeHandler(true, 'active?',)}/> <span  className="poppins align-self-center">Active </span>
					
						<input  
						checked={!brand['active?'] || false}
						type="radio" name="status" className="input-radio align-self-center" onChange={e => brandChangeHandler(false, 'active?')}/> <span  className="poppins align-self-center">Inactive</span>
					</div>
				</div>

			</div>

			<UiButton1 text="Save" submit={updateBrand}/>
		</div>
	)
}