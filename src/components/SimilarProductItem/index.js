import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  console.log(details)
  return (
    <li className="product-item-container">
      <img
        src={details.image_url}
        alt="similar product"
        className="product-item-image"
      />
      <p className="card-title">{details.title}</p>
      <p className="card-brand">by {details.brand}</p>
      <div className="price-rating-container">
        <p className="card-price">Rs {details.price}/-</p>
        <div className="card-rating-container">
          <p className="card-rating">{details.rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="card-rating-icon"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
