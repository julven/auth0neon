const BigQueryDelete = ({product, getDataList}) => {


	const { token, fetchData ,createProducModifyLog } = useContext(AppContext)


	const deleteProduct = async(e) => {
		e.preventDefault()

		let  conf = window.confirm("mark this product as deleted?")

		if(!conf) return;

		let sql = `
			INSERT INTO bispoke-sidekick.product_info.product_adds_edits_deletes 
			(record_id, IS_ADD_EDIT_DELETE, BY_USER)
			VALUES
			(
			${product.record_id},
			'DELETE',
			'${token.idTokenPayload.sub}'
			)

		`

		

		let resp = await fetchData(sql, "/bigquery-sql")
		createProducModifyLog("DELETE", product)
		console.log({deleteProduct: {resp}})

		getDataList()


	}

	return(

		<>
			<a href="#" onClick={deleteProduct}>delete</a>
		</>
	)
}