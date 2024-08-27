import { errorImg } from "../assets"

const ErrorComponent = ({ retryFn, message }) => {
  return (
    <div className="w-full py-14">
      <div className="flex flex-col items-center">
        <img src={errorImg} className="w-1/3" alt="error" />
        <pre>{message}</pre>
        <h4>Something went wrong please try again</h4>
        { retryFn && <button onClick={retryFn} className="mt-2 btn-primary">Try again</button> }
      </div>
    </div>
  )
}

export default ErrorComponent