import { Link } from "react-router-dom"

export function BottomWarning({label, buttonText, to}) {
    return <div className="py-2 text-sm flex justify-center">
        <div>
            {label}
        </div>
        <Link className="pointer underline p1-1 cursor-pointer ml-1 text-sky-500" to={to}>
          {buttonText} 
        </Link>
    </div>
}