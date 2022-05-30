import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProducts: [],
    count: 1,
    status: apiStatus.initial,
  }

  navigateToProducts = () => {
    const {history} = this.props
    console.log(history)
    history.replace('/products')
  }

  getFormatData = newData => ({
    availability: newData.availability,
    brand: newData.brand,
    description: newData.description,
    id: newData.id,
    imageUrl: newData.image_url,
    price: newData.price,
    rating: newData.rating,
    similarProducts: newData.similar_products,
    title: newData.title,
    totalReviews: newData.total_reviews,
  })

  getProductDetails = async () => {
    this.setState({status: apiStatus.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedData = this.getFormatData(data)
      this.setState({
        productDetails: formattedData,
        similarProducts: formattedData.similarProducts,
        status: apiStatus.success,
      })
    } else {
      this.setState({status: apiStatus.failure})
    }
  }

  componentDidMount = () => {
    this.getProductDetails()
  }

  decreaseCount = () => {
    const {count} = this.state
    console.log(count)
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  increaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    console.log(similarProducts)
    return (
      <div className="similar-products-container">
        <p className="similar-products-heading">Similar Products</p>
        <ul className="list-container">
          {similarProducts.map(similarProductObject => (
            <SimilarProductItem
              key={similarProductObject.id}
              details={similarProductObject}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {productDetails, count} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productDetails
    return (
      <>
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="details-container">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}</p>
            <div className="rating-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-icon"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="description">
              <span className="available">Available: </span>
              {availability}
            </p>
            <p className="description">
              <span className="available">Brand: </span>
              {brand}
            </p>
            <hr />
            <div className="count-container">
              <button
                onClick={this.decreaseCount}
                testid="minus"
                type="button"
                className="count-button"
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                onClick={this.increaseCount}
                testid="plus"
                type="button"
                className="count-button"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container">
      <div testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  renderFailureView = () => (
    <div className="error-container">
      <img
        className="error-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button
        onClick={this.navigateToProducts}
        type="button"
        className="continue-shopping-button"
      >
        Continue Shopping
      </button>
    </div>
  )

  renderProductView = () => {
    const {status} = this.state
    switch (status) {
      case 'SUCCESS':
        return this.renderProductDetails()

      case 'IN_PROGRESS':
        return this.renderLoader()

      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-details-bg-container">
          {this.renderProductView()}
        </div>
      </>
    )
  }
}
export default ProductItemDetails
