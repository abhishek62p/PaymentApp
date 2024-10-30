export function InputBox({ label, placeholder, onChange }) {
    return <div className="">
        {/* <div className="text-sm font-medium text-left py-2 ">{label}</div> */}
        <input onChange={onChange} placeholder={placeholder} className="px-3 mb-4 py-2 w-full rounded-md bg-zinc-100"/>
    </div>
}