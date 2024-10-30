export const Balance = ({ value }) => {
    return <div className="flex">
        <div className="font-bold text-lg">
            Your Balance
        </div>
        <div className="font-semibold m1-4 text-lg">
            Rs {value}
        </div>
    </div>
}