const Subscription = () => {

	const {
		fetchData,
		neonUser, 
		getNeonUser,
	} = useContext(AppContext)

	const navigate = useNavigate()

	const [products, setProducts] = useState([])
	const [range, setRange] = useState(0)
	const [subscribed, setSubscribed] = useState([])


	const getProducts = async () => {

		let resp  = await fetchData(null, "/stripe-products")
		console.log({getProducts:{resp}})

		setProducts(resp.data.reverse())
	}

	const createStripeCustomerId = async () => {

		console.log("create stripe customer id")

		let resp = await fetch(`${apiUrl}/stripe-customer`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				return myHeaders
			})(),
			body: JSON.stringify(neonUser)
		})

		resp = await resp.text()

		console.log({createStripeCustomerId: {resp}})
		getNeonUser()

		return
	}

	const getSubscription = async () => {
		setSubscribed([])

		let resp = await fetch(`${apiUrl}/stripe-get-subscription`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				return myHeaders
			})(),
			body: JSON.stringify({
				customer_id:neonUser.stripe_customer_id
			})

		})

		resp = await resp.json()

		console.log({getSubscription: {resp}})

		if("error" in resp) return

		setSubscribed(resp.data)
	}

	const createSubscription = async () => {
		

		let data = {
			url: `${baseUrl}#/subscription`,
			price: products[range].default_price,
			customer_id: neonUser.stripe_customer_id
		}
		// console.log({createSubscription:{data}})
		// return

		let resp = await fetch(`${apiUrl}/stripe-subscription`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				return myHeaders
			})(),
			body: JSON.stringify(data)
		})

		if(!resp.ok) {
			console.log("error in subscription")
			return
		}

		resp = await resp.text()

		console.log({createSubscription: {resp}})

		try{
			resp = JSON.parse(resp)
		}catch(err) {
			console.log("error in subscription", err)
			return
		}

		if(!("url" in resp)) {
			console.log("error in subscription")
			return
		}
		
		window.location.href=resp.url;

		return
	}


	const cancelSubscription = async (x) => {

		// console.log({cancelSubscription: {x}})

		// return

		let conf = confirm('cancel this subscription?')

		if(!conf) return

		let data = {
			customer_id: x.id 
		}
		// console.log({createSubscription:{data}})
		// return

		let resp = await fetch(`${apiUrl}/stripe-cancel-subscription`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				return myHeaders
			})(),
			body: JSON.stringify(data)
		})

		if(!resp.ok) {
			console.log("error in cancel subscription")
			return
		}

		resp = await resp.json()

		console.log({cancelSubscription: {resp}})

		getSubscription()

		return
	}

	const showProductName = (x, field) => {
	
		
		let result = products.filter( xx => xx.id == x.plan.product)

		if(result.length == 0) return ""

		console.log({showProductName:result})

		return result[0][field]
	
	}

	const viewPaymentHistory = async (e) => {

		console.log("view payment history")

		e.preventDefault()

		let resp = await fetch(`${apiUrl}/stripe-view-payment`, {
			method: "POST",
			headers: (() => {
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
				return myHeaders
			})(),
			body: JSON.stringify({	
				customer: neonUser.stripe_customer_id,
				return_url: baseUrl+"#/subscription"
			})
		})

		if(!resp.ok) {
			console.log("error in view payment history")
			return
		}

		resp = await resp.json()

		console.log({viewPaymentHistory: {resp}})

		window.location.href=resp.url;

		return


	}

	useEffect(() => {
		getProducts()
		getSubscription()
	}, [])

	useEffect(() => {
		console.log({subscribed})
	}, [subscribed])

	useEffect(() => {
		console.log(neonUser.stripe_customer_id)
		if(neonUser.user_id && neonUser.stripe_customer_id == null) createStripeCustomerId()
	}, [neonUser])

	if(ui) return <UiSubscription 
		subscribed={subscribed}
		showProductName={showProductName}
		cancelSubscription={cancelSubscription}
		products={products}
		range={range}
		setRange={setRange}
		createSubscription={createSubscription}
		viewPaymentHistory={viewPaymentHistory}
		/>;
	return (
		<div>
		{subscribed.length > 0 ?

		<div>
			<p>You have subscribed to the following plan:</p>

			{subscribed.map(x => (
				<div key={x.id}>
					<p>{showProductName(x,'name')}</p>	
					<p>{showProductName(x,'description')}</p>	
					<button onClick={() => cancelSubscription(x)}>cancel subscription</button>
				</div>


			))

			}

		</div>

		:
		<div>
			<p>subsciption</p>

			<p>select subsciption plan by scrolling the slider based on anual revenue/sales</p>

			<div>
			  <input type="range" min={0} max={products.length - 1} value={range} onChange={e => setRange(e.target.value)}/>&nbsp;
			  {products.length > 0 ?
			  <p>
			  {products[range].name}<br/>
			  {products[range].description}

			  </p>
			  :
				null
			  }
			  
			  <button onClick={createSubscription}>subscribe</button>
			</div>

		</div>

		}
			<a href="#" onClick={viewPaymentHistory}>payment history</a>
		</div>
	)
}